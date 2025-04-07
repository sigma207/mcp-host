import {
  Injectable,
  Logger,
} from '@nestjs/common'
import {
  McpCollectorService,
} from '../mcp-collector/mcp-collector.service'
import {
  HttpService,
} from '@nestjs/axios'
import {
  catchError, firstValueFrom,
} from 'rxjs'

import {
  isTextResourceContents,
} from '@/ts/types/mcp'
import {
  AxiosError,
} from 'axios'

@Injectable()
export class LightRagService {
  private readonly logger = new Logger(LightRagService.name)
  constructor(
    private readonly mcpCollectorService: McpCollectorService,
    private readonly httpService: HttpService,
  ) {}

  async rag() {
    this.logger.log('light-rag rag')
    await Promise.all(this.mcpCollectorService.allMcpServerInfo.map(async serverInfo => {
      this.logger.log(`light-rag rag ${serverInfo.name}`)
      const resources = await this.mcpCollectorService.getResources(serverInfo)
      const texts: string[] = []
      resources.forEach(resource => {
        if (isTextResourceContents(resource)) {
          texts.push(resource.text)
        }
      })
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:9621/documents/texts', {
          texts,
        }).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error)
            throw error
          })
        )
      )
      this.logger.log(response.data)
    }))
  }
}