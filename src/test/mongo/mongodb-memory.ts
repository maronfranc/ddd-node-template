import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from 'mongoose';

export class MongoDbMemory {
  private mongod: MongoMemoryServer;
  public constructor() {
    this.mongod = new MongoMemoryServer();
  }
  public async connect() {
    const uri = await this.mongod.getUri();
    await mongoose.connect(uri, <mongoose.ConnectOptions>{
      useNewUrlParser: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      useUnifiedTopology: true,
    });
  }
  public async closeDatabase() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await this.mongod.stop();
  }
}