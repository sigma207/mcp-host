import {
  Injectable,
  Logger,
} from '@nestjs/common'
import {
  McpPostgresService,
} from '@/modules/mcp-client/services/mcp-postgres.service'
import type {
  Tool,
  ToolCall,
} from 'ollama'

import {
  McpClientService,
  McpServerInfo,
} from '@/ts/types/mcp'
import {
  convertMcpToolsToOllamaTools,
  getClientResources,
} from '@/utils/mcp'

@Injectable()
export class McpCollectorService {
  private readonly logger = new Logger(McpCollectorService.name)
  allMcpServerInfo: McpServerInfo[] = []
  ollamaTools: Tool[] = []
  clientMap = new Map<string, McpClientService>()
  constructor(
    private readonly mcpPostgresService: McpPostgresService,
  ) {
    this.clientMap.set('postgres', this.mcpPostgresService)
  }
  async collect() {
    await Promise.all([...this.clientMap].map(async ([
      name,
      service,
    ]) => {
      await service.connect()
      const listResourcesResponse = await service.client.listResources()
      const listToolsResponse = await service.client.listTools()
      listToolsResponse.tools.forEach(tool => {
        // eslint-disable-next-line no-param-reassign
        tool.name = `${name}:${tool.name}`
      })
      this.allMcpServerInfo.push({
        name,
        resources: listResourcesResponse.resources,
        tools: listToolsResponse.tools,
      })
    }))
    this.logger.log(this.allMcpServerInfo)
    await Promise.all(this.allMcpServerInfo.map(async serverInfo => {
      this.ollamaTools.push(...convertMcpToolsToOllamaTools(serverInfo.tools))
    }))
  }
  async getResources(mcpServerInfo: McpServerInfo)  {
    const mcpClientService = this.clientMap.get(mcpServerInfo.name)
    if (!mcpClientService) {
      throw new Error(`Client not found for server: ${mcpServerInfo.name}`)
    }
    return await getClientResources(mcpClientService.client, mcpServerInfo.resources)
  }

  async executeToolCall(toolCall: ToolCall) {
    const data: string[] = []
    console.warn('tool call', toolCall.function.name, toolCall.function.arguments)
    const [
      key,
      functionName,
    ] = toolCall.function.name.split(':')
    const mcpClientService = this.clientMap.get(key)
    if (mcpClientService) {
      const callToolResponse = await mcpClientService.client.callTool({
        name: functionName,
        arguments: toolCall.function.arguments,
      })
      if (Array.isArray(callToolResponse.content)) {
        callToolResponse.content.forEach(content => {
          data.push(content.text)
        })
      }
    } else {
      console.warn(`Client not found for key: ${key}`)
    }
    return data
  }
}
