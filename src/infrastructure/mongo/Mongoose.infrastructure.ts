import mongoose from 'mongoose';
import { ExampleRepository } from '.';
import { configuration } from '../../environment';
import { UserRepository } from './user';

export class MongooseInfrastructure {
  public static repositories = {
    User: UserRepository,
    Example: ExampleRepository
  }
  public async init() {
    return mongoose.connect(configuration.mongo.url);
  }
}