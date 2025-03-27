import {
  Injectable,
} from '@nestjs/common'
import {
  EventsGateway,
} from '@/events/events.gateway'
import {
  ChatResponse,
  GenerateResponse,
} from 'ollama'

@Injectable()
export class SocketIoService {
  constructor(private socketGateway: EventsGateway) {}

  emitOllamaStreamResponse(response: ChatResponse | GenerateResponse) {
    // 在这里发送事件
    this.socketGateway.server.emit('ollamaStreamResponse', response)
  }
}