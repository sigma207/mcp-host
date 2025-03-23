import {
  Body,
  Controller,
  HttpCode,
  Get,
  Post,
} from '@nestjs/common'
import {
  AbortableAsyncIterator,
} from 'ollama'
import type {
  ChatResponse, Message,
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

  private messages: Message[] = []

  async handleOllamaStreamResponse(response: AbortableAsyncIterator<ChatResponse>) {
    const messages: Message = {
      role: 'assistant',
      content: '',
    }
    for await (const part of response) {
      this.socketIoService.emitOllamaStreamResponse(part)
      if (!part.done) {
        messages.content += part.message.content
      }
    }
    this.messages.push(messages)
  }
  @Post()
  @HttpCode(201)
  async ollamaChat(@Body() dto: CreateCompletionsDto) {
    this.messages.push({
      role: 'user',
      content: dto.message,
    })
    const response = await this.ollamaService.chat(this.messages)
    this.handleOllamaStreamResponse(response)
  }
  @Get()
  @HttpCode(200)
  getMessages() {
    return this.messages
  }
}
