import {
  HttpModule,
} from '@nestjs/axios'
import {
  Module,
} from '@nestjs/common'
import {
  LightRagService,
} from './light-rag.service'
import {
  McpCollectorModule,
} from '../mcp-collector/mcp-collector.module'

@Module({
  providers: [LightRagService],
  exports: [LightRagService],
  imports: [
    HttpModule,
    McpCollectorModule,
  ],
})
export class LightRagModule {}