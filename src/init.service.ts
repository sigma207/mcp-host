import {
  Injectable,
  OnModuleInit,
  Logger,
} from '@nestjs/common'
import {
  McpCollectorService,
} from '@/modules/mcp-collector/mcp-collector.service'
import {
  ChromaService,
} from '@/modules/chroma/chroma.service'
@Injectable()
export class InitService implements OnModuleInit {
  private readonly logger = new Logger(InitService.name)
  constructor(
    private readonly mcpCollectorService: McpCollectorService,
    private readonly chromaService: ChromaService,
  ) {
  }
  async onModuleInit() {
    this.logger.log('InitService onModuleInit')
    await this.mcpCollectorService.collect()
    await this.chromaService.initCollection()
    await this.chromaService.rag()
  }
}