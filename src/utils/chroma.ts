import crypto from 'crypto'
import {
  OllamaEmbeddingFunction,
} from 'chromadb'
import {
  Collection,
  type AddRecordsParams,
} from 'chromadb'
import type {
  ResourceContents, TextResourceContents,
} from '@modelcontextprotocol/sdk/types.js'

//mxbai-embed-large
export const mxbaiEmbeddingFunction = new OllamaEmbeddingFunction({
  model: 'mxbai-embed-large',
  url: 'http://localhost:11434/api/embeddings',
})
const isTextResourceContents = (resource: ResourceContents): resource is TextResourceContents => (resource .mimeType === 'application/json')

export const resourcesToDocuments = async (name: string, collection: Collection, mcpServerAllResourceContents: ResourceContents[]) => {
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