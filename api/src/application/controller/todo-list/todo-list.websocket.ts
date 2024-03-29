import Infrastructure from "../../../infrastructure/Infrastructure";
import todoListRepository from "../../../infrastructure/mongo/todo-list/todo-list.repository";
import { Get } from "../../library/decorators";
import { Param, WsConnection } from "../../library/decorators/route-params";
import { WebSocketGateway } from "../../library/decorators/websocket.decorator";
import { WebSocket } from '@fastify/websocket'

@WebSocketGateway('ws/todo-list')
export class TodoListWebsocket {
  @Get(':id/watch')
  async watchTodoList(
    @Param('id') id: string,
    @WsConnection() conn: WebSocket,
  ) {
    const todoListRepository = Infrastructure.repositories.todoList;
    const changeStream = todoListRepository.watch(id);
    // console.log(`[Log(${typeof changeStream}):changeStream]:`, changeStream);

    changeStream.on('change', (change) => {
      console.log(`[Log(${typeof change}):change]:`, change);
      conn.send(JSON.stringify({
        message: "change detected",
        data: change,
      }))
    });
    // changeStream.
    // for await (let change of changeStream) {
    //   console.log("Received change:\n", change);
    // }
    // await changeStream.close();

    conn.on('message', async (message) => {
      conn.send('23812897129')
    })


    // for (let i = 0; i <= 5; i++) {
    //   await sleep(1000)
    //   conn.send(JSON.stringify({ message: "Base message:" + i }))
    // }
    return { ok: true }
  }
}
function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
