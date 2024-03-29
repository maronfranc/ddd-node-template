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
    console.log(id);
    conn.on('message', async (message) => {
      console.info(`Message received: ${message}`)
      conn.send('Message received.')
    })
    return { ok: true }
  }
}
