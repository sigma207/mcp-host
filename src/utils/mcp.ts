import {
  Client, 
} from '@modelcontextprotocol/sdk/client/index.js'
import type {
  ListResourcesResult,
  ResourceContents,
  ListToolsResult,
} from '@modelcontextprotocol/sdk/types.js'
import type {
  Tool, 
} from 'ollama'

export const getClientResources = async (
  client: Client,
  resources: ListResourcesResult['resources'],
) => {
  const results: ResourceContents[] = []
  await Promise.all(
    resources.map(async resource => {
      // ignore any uppercase resources for icms postgresql
      if (/[A-Z]/.test(resource.name)) {
        return
      }
      const resourceData = await client.readResource(resource)
      results.push(...resourceData.contents)
    }),
  )
  return results
}

export const convertMcpToolsToOllamaTools = (mcpTools: ListToolsResult['tools']): Tool[] => {
  const mcpServerTools: Tool[] = []
  mcpTools.forEach(tool => {
    if (!tool.inputSchema.required || !Array.isArray(tool.inputSchema.required)) {
      // eslint-disable-next-line no-param-reassign
      tool.inputSchema.required = []
    }
    mcpServerTools.push({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description || 'No description',
        // TODO: Fix type error
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        parameters: tool.inputSchema,
      },
    })
  })
  return mcpServerTools
}
