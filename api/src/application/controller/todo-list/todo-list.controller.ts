import { DomainException, IDomainException } from "../../../domain/library/exceptions/domain.exception";
import { domainException } from "../../../domain/library/exceptions/exception-map";
import { todoItemException } from "../../../domain/todo-list/todo-item/todo-item.exception";
import { TodoListService } from "../../../domain/todo-list/todo-list.service";
import { ITodoItem } from "../../../infrastructure/entity-interfaces/todo-item.interface";
import { TODO_ITEM_STATUS } from "../../../infrastructure/mongo/todo-list/todo-list.schema";
import { Controller } from "../../library/decorators/controller.decorator";
import { Get, Patch, Post, Delete } from "../../library/decorators/request-mapping.decorator";
import { Body, Param } from "../../library/decorators/route-params";
import { isFilledArray, isFilledArrayKey, isOneOf } from "../../library/utils/type-validator";
import { CreateTodoItemDto } from "./dto/create-item.dto";
import { CreateTodoListDto } from "./dto/create-todo-list.dto";
import { UpdateTodoListDto } from "./dto/update-todo-list.dto";

@Controller("list")
export class TodoListController {
  @Get()
  public async find() {
    const todoListService = new TodoListService();
    const todoLists = await todoListService.findMany({});
    return { todoLists }
  }

  @Get(':id')
  public async findById(@Param('id') id: string) {
    const todoListService = new TodoListService();
    const todoList = await todoListService.findById(id);
    if (!todoList) {
      throw new DomainException(domainException['not-found']);
    }
    return { todoList };
  }

  @Get(':id/item/count')
  public async count(@Param('id') id: string) {
    const todoListService = new TodoListService();
    const result = await todoListService.countItemsStatus(id);
    return { count: result };
  }

  @Post()
  public async create(@Body() body: CreateTodoListDto) {
    const dto = new CreateTodoListDto(body)
    const todoListService = new TodoListService();
    const todoList = await todoListService.create(dto);
    return { todoList };
  }

  @Patch(":id")
  public async update(@Param('id') id: string, @Body() body: UpdateTodoListDto) {
    const todoListService = new TodoListService();
    const dto = new UpdateTodoListDto(body);
    const isUpdated = await todoListService.updateById(id, dto);
    return {
      todoList: { id, },
      updated: isUpdated,
    };
  }

  @Delete(":id")
  public async delete(@Param('id') id: string) {
    const todoListService = new TodoListService();
    const isDeleted = await todoListService.delete(id)
    return {
      todoList: { id },
      deleted: isDeleted
    };
  }

  @Post(':id/item-batch')
  public async createItems(
    @Param('id') id: string,
    @Body() body: { items: ITodoItem[] },
  ) {
    const todoListService = new TodoListService();
    if (!isFilledArray<ITodoItem>(body.items)) {
      throw new DomainException(todoItemException["invalid-array-of-items"]);
    }

    const dto = body.items.map((b) => new CreateTodoItemDto(b))
    const items = await todoListService.createManyItems(id, dto)
    return { todoList: { id, items } };
  }

  @Patch(':id/item-batch/status')
  public async updateItems(
    @Param('id') id: string,
    @Body() body: { status: string; items: Pick<ITodoItem, 'id'>[] },
  ) {
    const todoListService = new TodoListService();
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
    const todoListService = new TodoListService();
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
