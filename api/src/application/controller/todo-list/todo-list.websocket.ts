import todoListService from "../../../domain/todo-list/todo-list.service";
import todoListRepository from "../../../infrastructure/mongo/todo-list/todo-list.repository";
import { Get } from "../../library/decorators";
import { WsConnection } from "../../library/decorators/route-params";
import { WebSocketGateway } from "../../library/decorators/websocket.decorator";
import { WebSocket } from '@fastify/websocket'

@WebSocketGateway('ws/list')
export class TodoListWebsocket {
  @Get('watch')
  async watch(@WsConnection() conn: WebSocket) {
    type OptionalStream = null
      | ReturnType<(typeof todoListRepository)['watchChangesByIds']>;
    let changeStream: OptionalStream = null;
    let watchlist: Set<string> = new Set();

    conn.on('message', async (msgRaw) => {
      try {
        const msg: WatchTodoListMessage = JSON.parse(msgRaw.toString());
        if (msg.command === 'get-watchlist') {
          conn.send(JSON.stringify({ watchlist: [...watchlist] }));
        }

        if (msg.command === 'watch' || msg.command === 'remove') {
          if (msg.command === 'watch') {
            msg.todoListIds.forEach((id) => watchlist.add(id));
          }
          if (msg.command === 'remove') {
            msg.todoListIds.forEach((id) => watchlist.delete(id));
          }

          if (!!changeStream) await changeStream.close();
          if (watchlist.size === 0) {
            changeStream = null;
            const msg = { message: 'Watchlist is empty closing connection...' }
            conn.send(JSON.stringify(msg));
            return conn.close();
          }

          changeStream = todoListRepository.watchChangesByIds([...watchlist]);
          changeStream.on('change', async (data) => {
            const changeResponse = todoListService.handleChange(data);
            if (changeResponse) conn.send(JSON.stringify(changeResponse));
          });

          conn.send(JSON.stringify({ acknowledged: true }));
        }
      } catch (err: any) {
        const errMsg = {
          acknowledged: false,
          detail: err.message ?? 'Invalid message received',
        };
        conn.send(JSON.stringify(errMsg));
      }
    });

    const availableMessages: WatchTodoListMessage[] = [
      { command: 'watch', todoListIds: ['string[]'] },
      { command: 'get-watchlist' },
      { command: 'remove', todoListIds: ['string[]'] },
    ];
    return { messages: availableMessages };
  }

  @Get('ping')
  async ping(@WsConnection() conn: WebSocket) {
    conn.on('message', async (message) => {
      console.info(message);
      conn.send(JSON.stringify({ message: 'Message received.' }));
    });
    return { acknowledged: true };
  }
}

export type WatchTodoListMessage =
  | { command: 'watch'; todoListIds: string[]; }
  | { command: 'get-watchlist'; }
  | { command: 'remove'; todoListIds: string[]; };
