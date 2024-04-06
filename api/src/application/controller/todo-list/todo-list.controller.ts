import { DomainException } from "../../../domain/library/exceptions/domain.exception";
import { domainException } from "../../../domain/library/exceptions/exception-map";
import { todoItemException } from "../../../domain/todo-list/todo-item/todo-item.exception";
import todoListService from "../../../domain/todo-list/todo-list.service";
import { ITodoItem } from "../../../infrastructure/entity-interfaces/todo-item.interface";
import { ITodoList } from "../../../infrastructure/entity-interfaces/todo-list.interface";
import { TODO_ITEM_STATUS } from "../../../infrastructure/mongo/todo-list/todo-list.schema";
import { Controller } from "../../library/decorators/controller.decorator";
import { Get, Patch, Post, Delete } from "../../library/decorators/request-mapping.decorator";
import { Body, Param } from "../../library/decorators/route-params";
import { isFilledArray, isFilledArrayKey, isOneOf } from "../../library/utils/type-validator";
import { validateCreateTodoItemDto } from "./dto/create-item.dto";
import { validateCreateTodoListDto } from "./dto/create-todo-list.dto";
import { validateUpdateTodoListDto } from "./dto/update-todo-list.dto";

@Controller("list")
export class TodoListController {
  @Get()
  public async find() {
    const todoLists = await todoListService.findMany({});
    return { todoLists }
  }

  @Get(':id')
  public async findById(@Param('id') id: string) {
    const todoList = await todoListService.findById(id);
    if (!todoList) {
      throw new DomainException(domainException['not-found']);
    }
    return { todoList };
  }

  @Get(':id/item/count')
  public async count(@Param('id') id: string) {
    const result = await todoListService.countItemsStatus(id);
    return { count: result };
  }

  @Post()
  public async create(@Body() body: ITodoList) {
    const { error, result: dto } = validateCreateTodoListDto(body)
    if (error) throw new DomainException(error);

    const todoList = await todoListService.create(dto);
    return { todoList };
  }

  @Patch(":id")
  public async update(@Param('id') id: string, @Body() body: ITodoItem) {
    const { error, result: dto } = validateUpdateTodoListDto(body);
    if (error) throw new DomainException(error);

    const isUpdated = await todoListService.updateById(id, dto);
    return {
      todoList: { id },
      updated: isUpdated,
    };
  }

  @Delete(":id")
  public async delete(@Param('id') id: string) {
    const isDeleted = await todoListService.delete(id)
    return {
      todoList: { id },
      deleted: isDeleted,
    };
  }

  @Post(':id/item-batch')
  public async createItems(
    @Param('id') id: string,
    @Body() body: { items: ITodoItem[] },
  ) {
    if (!isFilledArray<ITodoItem>(body.items)) {
      throw new DomainException(todoItemException["invalid-array-of-items"]);
    }

    const dto = body.items.map((b) => {
      const { error, result: validDto } = validateCreateTodoItemDto(b);
      if (error) throw new DomainException(error);
      return validDto;
    })

    const items = await todoListService.createManyItems(id, dto)
    return { todoList: { id, items } };
  }

  @Patch(':id/item-batch/status')
  public async updateItems(
    @Param('id') id: string,
    @Body() body: { status: string; items: Pick<ITodoItem, 'id'>[] },
  ) {
    const newStatus = body.status as string;
    if (!isOneOf(newStatus, [...TODO_ITEM_STATUS])) {
      throw new DomainException(todoItemException["invalid-item-status"])
    }

    const items = body.items as Pick<ITodoItem, 'id'>[] | undefined;
    if (!isFilledArrayKey(items, 'id')) {
      throw new DomainException(
        todoItemException["invalid-array-of-items-id"]);
    }

    const ids = items.map((item) => item.id);
    const isUpdated = await todoListService
      .updateManyItemsStatus(id, ids, newStatus);
    return {
      todoList: { id, itemIds: ids },
      updated: isUpdated,
    };
  }

  @Delete(':id/item-batch')
  public async deleteItems(
    @Param('id') id: string,
    @Body() body: { items: Pick<ITodoItem, 'id'>[] },
  ) {
    const items = body.items;
    if (!isFilledArrayKey(items, 'id')) {
      throw new DomainException(
        todoItemException["invalid-array-of-items-id"]);
    }

    const ids = items.map((item) => item.id);
    const isDeleted = await todoListService.deleteManyItemsByIds(id, ids);;
    return {
      todoList: { id, itemIds: ids },
      deleted: isDeleted,
    };
  }
}
