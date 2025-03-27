import {
  Body,
  Controller,
  HttpCode,
  Get,
  Post,
  Logger,
} from '@nestjs/common'
import {
  AbortableAsyncIterator,
} from 'ollama'
import type {
  ChatResponse,
  GenerateResponse,
  Message,
  ToolCall,
} from 'ollama'
import {
  CreateCompletionsDto,
} from '@/dto/completions.dto'
import {
  OllamaService,
} from '@/modules/ollama/ollama.service'
import {
  SocketIoService,
} from '@/services/socket-io.service'
import {
  ChromaService,
} from '@/modules/chroma/chroma.service'
import {
  McpCollectorService,
} from '@/modules/mcp-collector/mcp-collector.service'
/**
 * export class CreateCompletionsDto {
 *   message: string
 * }
 */
@Controller()
export class CompletionsController  {
  logger = new Logger(CompletionsController.name)
  private messages: Message[] = []
  constructor(
    private readonly ollamaService: OllamaService,
    private readonly socketIoService: SocketIoService,
    private readonly chromaService: ChromaService,
    private readonly mcpCollectorService: McpCollectorService,
  ) {}

  async executeToolCall(toolCalls: ToolCall[]) {
    const toolResults: string[] = []
    await Promise.all(toolCalls.map(async toolCall => {
      const data = await this.mcpCollectorService.executeToolCall(toolCall)
      toolResults.push(...data)
    }))
    const response = await this.ollamaService.finishChat(this.messages[this.messages.length - 1].content, toolResults)
    this.handleOllamaGenerateStreamResponse(response)
  }
  async handleOllamaGenerateStreamResponse(response: AbortableAsyncIterator<GenerateResponse>) {
    const messages: Message = {
      role: 'assistant',
      content: '',
    }
    for await (const part of response) {
      // this.logger.log(part)
      this.socketIoService.emitOllamaStreamResponse(part)
      if (!part.done) {
        messages.content += part.response
      }
    }
    this.messages.push(messages)
    console.log(this.messages)
  }
  async handleOllamaChatStreamResponse(response: AbortableAsyncIterator<ChatResponse>) {
    const messages: Message = {
      role: 'assistant',
      content: '',
    }
    for await (const part of response) {
      // this.logger.log(part)
      if (part.message.tool_calls && part.message.tool_calls.length > 0) {
        this.executeToolCall(part.message.tool_calls)
      }
      this.socketIoService.emitOllamaStreamResponse(part)
      if (!part.done) {
        messages.content += part.message.content
      }
    }
    this.messages.push(messages)
    console.log(this.messages)
  }
  @Post()
  @HttpCode(201)
  async ollamaChat(@Body() dto: CreateCompletionsDto) {
    const queryResults = await this.chromaService.query(dto.message)
    const hasRelatedResult = queryResults.length > 0
    this.messages.push({
      role: 'user',
      content: dto.message,
    })

    if (hasRelatedResult) {
      const response = await this.ollamaService.chatWithTools(this.messages, queryResults, this.mcpCollectorService.ollamaTools)
      if (response.message.tool_calls && response.message.tool_calls.length > 0) {
        this.executeToolCall(response.message.tool_calls)
      } else {
        this.logger.warn(`No tool calls found: ${dto.message}`)
        // TODO: Handle no tool calls
      }
    } else {
      const response = await this.ollamaService.chat(this.messages)
      this.handleOllamaChatStreamResponse(response)
    }
  }
  @Get()
  @HttpCode(200)
  getMessages() {
    return this.messages
  }
}
