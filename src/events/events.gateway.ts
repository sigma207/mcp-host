
import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import {
  Server,
  Socket,
} from 'socket.io'
import {
  ServerToClientEvents,
} from '@/ts/types/socket-io'

type TypedServer = Server<never, ServerToClientEvents>

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: TypedServer

  handleConnection(client: Socket) {
    console.log('Client connected', client.id)
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id)
  }
}