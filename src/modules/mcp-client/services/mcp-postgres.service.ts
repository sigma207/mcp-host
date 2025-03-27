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
    '../servers/postgres/dist/index.js',
    'postgresql://root:root@localhost:5432/northwind',
  ],
})

@Injectable()
export class McpPostgresService implements McpClientService {
  public client: Client

  constructor() {
    this.client = new Client({
      name: 'postgres',
      version: '1.0.0',
    }, {
      capabilities: {},
    })
  }
  connect() {
    this.client.connect(transport)
  }
}