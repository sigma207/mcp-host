import {
  Module,
} from '@nestjs/common'
import {
  CompletionsController,
} from './completions.controller'
import {
  SocketIoService,
} from '@/services/socket-io.service'
import {
  EventsModule,
} from '@/events/events.module'
import {
  OllamaModule,
} from '@/modules/ollama/ollam.module'
import {
  ChromaModule,
} from '@/modules/chroma/chroma.module'
import {
  McpCollectorModule,
} from '@/modules/mcp-collector/mcp-collector.module'
@Module({
  imports: [
    EventsModule,
    OllamaModule,
    ChromaModule,
    McpCollectorModule,
  ],
  providers: [SocketIoService],
  controllers: [CompletionsController],
})
export class CompletionsModule {}
