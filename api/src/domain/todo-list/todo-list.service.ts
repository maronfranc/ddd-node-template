import { CreateTodoListDto } from "../../application/controller/todo-list/dto/create-todo-list.dto";
import infrastructure from "../../infrastructure/Infrastructure";
import { ITodoItem } from "../../infrastructure/entity-interfaces/todo-item.interface";
import { ITodoList } from "../../infrastructure/entity-interfaces/todo-list.interface";

export class TodoListService {
  public constructor(
    public readonly todoListRepository = infrastructure.repositories.todoList
  ) { }
  public async findMany(condition: Partial<ITodoList>): Promise<ITodoList[]> {
    return this.todoListRepository.find(condition);
  }
  public async findById(id: string) {
    return this.todoListRepository.findById(id);
  }
  public async create(dto: CreateTodoListDto): Promise<ITodoList> {
    return this.todoListRepository.create({
      title: dto.title,
      description: dto.description,
    });
  }
  public async updateById(id: string, dto: Partial<ITodoList>): Promise<boolean> {
    return this.todoListRepository.updateById(id, dto);
  }
  public async delete(id: string): Promise<boolean> {
    return this.todoListRepository.deleteById(id);
  }
  public async createManyItems(id: string, items: ITodoItem[]) {
    return this.todoListRepository.createItemsByIds(id, items);
  }
  public async updateManyItemsStatus(
    id: string,
    ids: string[],
    status: ITodoItem['status'],
  ) {
    return this.todoListRepository.updateItemsStatusByIds(id, ids, status);
  }
  public async deleteManyItemsByIds(
    id: string,
    ids: string[],
  ) {
    return this.todoListRepository.deleteItemsByIds(id, ids);
  }
  public async countItemsStatus(id: string) {
    return this.todoListRepository.countItemsStatus(id);
  }
}

