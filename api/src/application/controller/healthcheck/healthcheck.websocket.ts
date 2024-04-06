import { Get } from '../../library/decorators';
import { WsConnection } from '../../library/decorators/route-params';
import { WebSocketGateway } from '../../library/decorators/websocket.decorator';
import { WebSocket } from '@fastify/websocket'

@WebSocketGateway('ws/healthcheck')
export class HealthcheckWebsocket {
  @Get('ping')
  public async ping(@WsConnection() conn: WebSocket) {
    conn.on('message', async (_msgRaw) => {
      // const msg = JSON.parse(msgRaw.toString());
      conn.send(JSON.stringify({ message: "Message received" }))
    });
    conn.send(JSON.stringify({ message: "Waiting message..." }))

    return { status: 'READY' }
  }
}
