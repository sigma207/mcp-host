import {
  Module,
} from '@nestjs/common'
import {
  McpPostgresService,
} from './services/mcp-postgres.service'

@Module({
  providers: [McpPostgresService],
  exports: [McpPostgresService],
})
export class McpClientModule {}