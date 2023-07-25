import mongoose from 'mongoose';
import exampleRepository from './example/example.repository';
import { configuration } from '../../environment';
import userRepository from './user/user.repository';

export class MongooseInfrastructure {
  public repositories = {
    user: userRepository,
    example: exampleRepository
  }
  public async init() {
    return mongoose.connect(configuration.mongo.url);
  }
}
