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
// import {
//   LightRagService,
// } from './modules/light-rag/light-rag.service'
@Injectable()
export class InitService implements OnModuleInit {
  private readonly logger = new Logger(InitService.name)
  constructor(
    private readonly mcpCollectorService: McpCollectorService,
    private readonly chromaService: ChromaService,
    // private readonly lightRagService: LightRagService,
  ) {
  }
  async onModuleInit() {
    this.logger.log('InitService onModuleInit')
    await this.mcpCollectorService.collect()
    // await this.lightRagService.rag()
    await this.chromaService.initCollection()
    await this.chromaService.rag()
  }
}