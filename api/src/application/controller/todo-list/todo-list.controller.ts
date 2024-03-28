import { DomainException } from "../../../domain/library/exceptions/domain.exception";
import { domainException } from "../../../domain/library/exceptions/exception-map";
import { todoItemException } from "../../../domain/todo-list/todo-item/todo-item.exception";
import { TodoListService } from "../../../domain/todo-list/todo-list.service";
import { ITodoItem } from "../../../infrastructure/entity-interfaces/todo-item.interface";
import { TODO_ITEM_STATUS } from "../../../infrastructure/mongo/todo-list/todo-item/todo-item.schema";
import { Next, Req, Res } from "../../express/express.interfaces";
import { Controller } from "../../library/decorators/controller.decorator";
import { Get, Patch, Post, Delete } from "../../library/decorators/request-mapping.decorator";
import { HttpStatus } from "../../library/http/http-status.enum";
import { isFilledArray, isFilledArrayKey, isOneOf } from "../../library/utils/type-validator";
import { CreateTodoItemDto } from "./dto/create-item.dto";
import { CreateTodoListDto } from "./dto/create-todo-list.dto";
import { UpdateTodoListDto } from "./dto/update-todo-list.dto";

@Controller("todo-list")
export class TodoListController {
  @Get()
  public async find(_: Req, res: Res): Promise<void> {
    const todoListService = new TodoListService();
    const todoLists = await todoListService.findMany({});
    res.status(HttpStatus.OK).send({ todoLists });
  }
  @Get(':id')
  public async findById(req: Req, res: Res, next: Next): Promise<void> {
    const id = req.params.id;
    const todoListService = new TodoListService();
    const todoList = await todoListService.findById(id);
    if (!todoList) {
      return next(new DomainException(domainException['not-found']))
    }
    res.status(HttpStatus.OK).send({ todoList });
  }
  @Get(':id/items/count')
  public async count(req: Req, res: Res): Promise<void> {
    const id = req.params.id;
    const todoListService = new TodoListService();
    const result = await todoListService.countItemsStatus(id);
    res.status(HttpStatus.OK).send({ count: result });
  }
  @Post()
  public async create(req: Req, res: Res): Promise<void> {
    const dto = new CreateTodoListDto(req?.body)
    const todoListService = new TodoListService();
    const todoList = await todoListService.create(dto);
    res.status(HttpStatus.OK).send({ todoList });
  }
  @Patch(":id")
  public async update(req: Req, res: Res): Promise<void> {
    const id = req.params.id;
    const todoListService = new TodoListService();
    const dto = new UpdateTodoListDto(req.body);
    const isUpdated = await todoListService.updateById(id, dto);
    res.status(HttpStatus.OK).send({
      todoList: { id, },
      updated: isUpdated,
    });
  }
  @Delete(":id")
  public async delete(req: Req, res: Res): Promise<void> {
    const id = req.params.id;
    const todoListService = new TodoListService();
    const isDeleted = await todoListService.delete(id)
    res.status(HttpStatus.OK).send({
      todoList: { id },
      deleted: isDeleted
    });
  }
  @Post(':id/item-batch')
  public async createItems(req: Req, res: Res): Promise<void> {
    const todoListService = new TodoListService();
    const id = req.params.id;
    if (!isFilledArray<ITodoItem>(req.body)) {
      throw new DomainException(todoItemException["invalid-array-of-items"]);
    }
    const dto = req.body.map((b) => new CreateTodoItemDto(b))
    const items = await todoListService.createManyItems(id, dto)
    res.status(HttpStatus.CREATED).send({
      todoList: { id, items },
    });
  }
  @Patch(':id/item-batch')
  public async updateItems(req: Req, res: Res): Promise<void> {
    const todoListService = new TodoListService();
    const id = req.params.id as string;
    const newStatus = req.body.status as string;
    if (!isOneOf(newStatus, [...TODO_ITEM_STATUS])) {
      throw new DomainException(todoItemException["invalid-item-status"])
    }
    const items = req.body.items as Pick<ITodoItem, 'id'>[] | undefined;
    if (!isFilledArrayKey(items, 'id')) {
      throw new DomainException(
        todoItemException["invalid-array-of-items-id"]);
    }
    const ids = items.map((item) => item.id);
    const isUpdated = await todoListService
      .updateManyItemsStatus(id, ids, newStatus);
    res.status(HttpStatus.CREATED).send({
      todoList: { id, itemIds: ids },
      updated: isUpdated,
    });
  }
  @Delete(':id/item-batch')
  public async deleteItems(req: Req, res: Res): Promise<void> {
    const todoListService = new TodoListService();
    const id = req.params.id as string;
    const items = req.body.items as Pick<ITodoItem, 'id'>[] | undefined;
    if (!isFilledArrayKey(items, 'id')) {
      throw new DomainException(
        todoItemException["invalid-array-of-items-id"]);
    }
    const ids = items.map((item) => item.id);
    const isDeleted = await todoListService.deleteManyItemsByIds(id, ids);

    res.status(HttpStatus.OK).send({
      todoList: { id, itemIds: ids },
      deleted: isDeleted,
    });
  }
}
