import {
  Module,
} from '@nestjs/common'
import {
  CompletionsController,
} from './completions.controller'
import {
  OllamaService,
} from '@/services/ollama.service'
import {
  SocketIoService,
} from '@/services/socket-io.service'
import {
  EventsModule,
} from '@/events/events.module'

@Module({
  imports: [EventsModule],
  providers: [
    OllamaService,
    SocketIoService,
  ],
  controllers: [CompletionsController],
})
export class CompletionsModule {}