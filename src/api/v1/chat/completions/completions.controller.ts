import {
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import {
  AbortableAsyncIterator,
  ChatResponse,
} from 'ollama'
import {
  CreateCompletionsDto,
} from '@/dto/completions.dto'
import {
  OllamaService,
} from '@/services/ollama.service'
import {
  SocketIoService,
} from '@/services/socket-io.service'

/**
 * export class CreateCompletionsDto {
 *   message: string
 * }
 */
@Controller()
export class CompletionsController  {
  constructor(private readonly ollamaService: OllamaService, private readonly socketIoService: SocketIoService) {}

  async handleOllamaStreamResponse(response: AbortableAsyncIterator<ChatResponse>) {
    for await (const part of response) {
      this.socketIoService.emitOllamaStreamResponse(part)
    }
  }
  @Post()
  @HttpCode(201)
  async ollamaChat(@Body() dto: CreateCompletionsDto) {
    const response = await this.ollamaService.chat(dto.message)
    this.handleOllamaStreamResponse(response)
  }
}
