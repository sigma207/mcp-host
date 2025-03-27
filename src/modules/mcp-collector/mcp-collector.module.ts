import {
  Module,
} from '@nestjs/common'
import {
  McpCollectorService,
} from './mcp-collector.service'
import {
  McpClientModule,
} from '../mcp-client/mcp-client.module'

@Module({
  providers: [McpCollectorService],
  exports: [McpCollectorService],
  imports: [McpClientModule],
})
export class McpCollectorModule {}