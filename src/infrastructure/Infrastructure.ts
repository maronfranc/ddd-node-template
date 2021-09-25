import { MongooseInfrastructure } from "./mongo/Mongoose.infrastructure";

export interface IConnectOptions {
    onConnected?: () => void;
    onError?: (...args: any[]) => void;
    onProcessExit?: () => void;
}

export class Infrastructure extends MongooseInfrastructure { }