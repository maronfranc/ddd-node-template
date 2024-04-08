import mongoose from 'mongoose';
import { configuration } from '../../environment';

export class MongooseInfrastructure {
  private mongo: typeof mongoose | null = null;
  public async init() {
    this.mongo = await mongoose.connect(configuration.mongo.url);
    return this.mongo;
  }

  public async close() {
    if (this.mongo) await this.mongo.connection.close();
  }
}
