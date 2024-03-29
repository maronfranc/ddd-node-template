export type IController = { new(): any };
export type IWebsocketGateway = { new(): any };

export interface IInitOption {
  logger?: ILogger;
}

export interface ILogger {
  info: (...messages: any[]) => void;
  log: (...messages: any[]) => void;
  warn: (...messages: any[]) => void;
  error: (...messages: any[]) => void;
}
