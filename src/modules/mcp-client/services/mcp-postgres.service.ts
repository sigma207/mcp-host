import {
  Injectable,
} from '@nestjs/common'
import {
  Client,
} from '@modelcontextprotocol/sdk/client/index.js'
import {
  StdioClientTransport,
} from '@modelcontextprotocol/sdk/client/stdio.js'
import {
  McpClientService,
} from '@/ts/types/mcp'
import {
  ConfigService,
} from '@nestjs/config'



@Injectable()
export class McpPostgresService implements McpClientService {
  public client: Client
  constructor(private configService: ConfigService) {
    this.client = new Client(
      {
        name: 'postgres',
        version: '1.0.0',
      },
      {
        capabilities: {},
      },
    )
  }
  connect() {
    const postgresPath = this.configService.get('MCP_SERVER_POSTGRESQL_PATH')
    const postgresUri = this.configService.get('MCP_SERVER_POSTGRESQL_URI')
    const transport = new StdioClientTransport({
      command: 'node',
      args: [
        postgresPath,
        postgresUri,
      ],
    })
    this.client.connect(transport)
  }
}
