import  {
  type ListResourcesResult, type ListToolsResult,
} from '@modelcontextprotocol/sdk/types.js'
import {
  Client,
} from '@modelcontextprotocol/sdk/client/index.js'

export interface McpServerInfo {
  name: string,
  resources: ListResourcesResult['resources'],
  tools: ListToolsResult['tools'],
}

export interface McpClientService {
  client: Client,
  connect: () => void,
}