import mongoose from 'mongoose';
import { configuration } from '../../environment';
import userRepository from './user/user.repository';
import todoListRepository from './todo-list/todo-list.repository';

export class MongooseInfrastructure {
  private mongo: typeof mongoose | null = null;
  public repositories = {
    user: userRepository,
    todoList: todoListRepository,
  }
  public async init() {
    this.mongo = await mongoose.connect(configuration.mongo.url);
    return this.mongo;
  }

  public async close() {
    if (this.mongo) await this.mongo.connection.close();
  }
}
