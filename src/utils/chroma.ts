import crypto from 'crypto'
import {
  Collection,
  OllamaEmbeddingFunction,
  type AddRecordsParams,
} from 'chromadb'
import type {
  ResourceContents,
} from '@modelcontextprotocol/sdk/types.js'

import {
  isTextResourceContents,
} from '@/ts/types/mcp'

//mxbai-embed-large
export const mxbaiEmbeddingFunction = (ollamaHost: string) => new OllamaEmbeddingFunction({
  model: 'mxbai-embed-large',
  url: `${ollamaHost}/api/embeddings`,
})

export const resourcesToDocuments = async (
  name: string,
  collection: Collection,
  mcpServerAllResourceContents: ResourceContents[],
) => {
  const documents: AddRecordsParams = {
    ids: [],
    documents: [],
    metadatas: [],
  }
  mcpServerAllResourceContents.forEach(resource => {
    if (isTextResourceContents(resource)) {
      documents.ids.push(crypto.randomUUID())
      const metadatas = {
        name,
        uri: resource.uri,
        mimeType: '',
      }
      if (typeof resource.mimeType === 'string') {
        metadatas.mimeType = resource.mimeType
      }
      documents.metadatas?.push(metadatas)
      documents.documents.push(resource.text)
    }
    // console.log('resource', resource)
  })
  // console.log(documents)
  await collection.add(documents)
}
