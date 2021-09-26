import mongoose from 'mongoose';
import { ExampleRepository } from '.';
import { configuration } from '../../config/environment';
import { IConnectOptions } from '../Infrastructure';
import { UserRepository } from './user';

const emptyCallback = () => { };

export class MongooseInfrastructure {
  public static repositories = {
    User: UserRepository,
    Example: ExampleRepository
  }
  public init(opts?: IConnectOptions) {
    mongoose.connect(configuration.mongo.url);
    mongoose.connection.on('connected', opts?.onConnected ?? emptyCallback);
    mongoose.connection.on('error', opts?.onError ?? emptyCallback);
    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        if (typeof opts?.onProcessExit === "function") opts?.onProcessExit();
        process.exit(0);
      });
    });
  }
}