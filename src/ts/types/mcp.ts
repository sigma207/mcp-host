import type {
  ListResourcesResult,
  ListToolsResult,
  ResourceContents,
  TextResourceContents,
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

export const isTextResourceContents = (resource: ResourceContents): resource is TextResourceContents =>
  resource.mimeType === 'text/plain' || resource.mimeType === 'application/json'