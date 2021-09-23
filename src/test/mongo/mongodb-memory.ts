import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from 'mongoose';

export class MongoDbMemory {
  private mongod: MongoMemoryServer | null = null;
  public async connect() {
    if (this.mongod === null) {
      this.mongod = await MongoMemoryServer.create();
    }
    const uri = this.mongod.getUri();
    await mongoose.connect(uri);
  }
  public async closeDatabase() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (this.mongod !== null) await this.mongod.stop();
  }
}