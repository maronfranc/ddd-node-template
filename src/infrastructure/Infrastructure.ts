import { MongooseInfrastructure } from "./mongo/Mongoose.infrastructure";

export interface IConnectOptions {
    onConnected?: () => void;
    onError?: (...args: any[]) => void;
    onProcessExit?: () => void;
}

export class Infrastructure {
    public init(options?: IConnectOptions) {
        const conn = new MongooseInfrastructure();
        conn.connect(options);
    }
}