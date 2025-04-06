
import {
  Injectable,
  Logger,
} from '@nestjs/common'
import {
  ChromaClient,
  Collection,
  IncludeEnum,
  type Document,
} from 'chromadb'

import {
  McpCollectorService,
} from '@/modules/mcp-collector/mcp-collector.service'
import {
  resourcesToDocuments,
  mxbaiEmbeddingFunction,
} from '@/utils/chroma'
import {
  ConfigService,
} from '@nestjs/config'

const CHROMA_DB_N_RESULTS = 3
const DISTANCE_THRESHOLD = 0.46
const COLLECTION_NAME = 'collection'

@Injectable()
export class ChromaService {
  chromaClient: ChromaClient
  collection: Collection
  logger = new Logger(ChromaService.name)
  constructor(
    private readonly mcpCollectorService: McpCollectorService,
    private readonly configService: ConfigService,
  ) {}

  async initCollection() {
    this.logger.log('initCollection')
    this.chromaClient = new ChromaClient({
      path: 'http://localhost:8000',
    })
    const heartbeat = await this.chromaClient.heartbeat()
    this.logger.log(heartbeat)
    try {
      await this.chromaClient.deleteCollection({ name: COLLECTION_NAME })
    } catch {
      this.logger.warn('deleteCollection error')
    }
    const ollamaHost = this.configService.get('OLLAMA_HOST')
    this.collection = await this.chromaClient.getOrCreateCollection({
      name: COLLECTION_NAME,
      embeddingFunction: mxbaiEmbeddingFunction(ollamaHost),
      metadata: {
        'hnsw:space': 'ip',
      },
    })
  }
  async rag() {
    await Promise.all(this.mcpCollectorService.allMcpServerInfo.map(async serverInfo => {
      const resources = await this.mcpCollectorService.getResources(serverInfo)
      await resourcesToDocuments(serverInfo.name, this.collection, resources)
    }))
  }
  async query(message: string) {
    this.logger.log('chroma query', message)
    const results = await this.collection.query({
      queryTexts: [message], // Chroma will embed this for you
      nResults: CHROMA_DB_N_RESULTS, // how many results to return
      include: [
        IncludeEnum.Documents,
        IncludeEnum.Distances,
      ],
    })
    const filteredDocuments: (Document)[] = []
    results.distances?.forEach((distanceList, queryIndex) => {
      distanceList.forEach((distance, index) => {
        if (distance <= DISTANCE_THRESHOLD && results.documents[queryIndex][index]) {
          filteredDocuments.push(results.documents[queryIndex][index])
        }
      })
    })
    results.documents.forEach(documentList => {
      documentList.forEach(document => {
        this.logger.log(document)
      })
    })
    this.logger.log(results.distances)
    return filteredDocuments
  }
}