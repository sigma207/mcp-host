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

const transport = new StdioClientTransport({
  command: 'node',
  args: [
    '../servers/mcp-server-postgresql/dist/index.js',
    'postgresql://postgres:postgres@10.136.219.127:5432/DB_Delta_Platform',
  ],
})

@Injectable()
export class McpPostgresService implements McpClientService {
  public client: Client

  constructor() {
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
    this.client.connect(transport)
  }
}
