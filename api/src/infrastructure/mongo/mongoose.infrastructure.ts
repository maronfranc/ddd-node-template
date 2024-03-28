import mongoose from 'mongoose';
import exampleRepository from './example/example.repository';
import { configuration } from '../../environment';
import userRepository from './user/user.repository';
import todoListRepository from './todo-list/todo-list.repository';

export class MongooseInfrastructure {
  public repositories = {
    user: userRepository,
    todoList: todoListRepository,
    example: exampleRepository,
  }
  public async init() {
    return mongoose.connect(configuration.mongo.url);
  }
}
