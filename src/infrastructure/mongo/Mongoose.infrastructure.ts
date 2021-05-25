import mongoose from 'mongoose';
import { configuration } from '../../config/environment';
import { IConnectOptions } from '../Infrastructure';

const MONGO_URL = configuration.mongo.url;
const emptyCallback = () => { };

export class MongooseInfrastructure {
  public constructor() { }
  public connect(opts?: IConnectOptions) {
    mongoose.connect(MONGO_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    });
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