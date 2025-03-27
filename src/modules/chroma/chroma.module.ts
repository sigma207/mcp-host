import {
  Module,
} from '@nestjs/common'
import {
  McpCollectorModule,
} from '../mcp-collector/mcp-collector.module'
import {
  ChromaService,
} from './chroma.service'

@Module({
  providers: [ChromaService],
  exports: [ChromaService],
  imports: [McpCollectorModule],
})
export class ChromaModule {}