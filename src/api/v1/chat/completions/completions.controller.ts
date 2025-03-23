import {
  Body,
  Controller, 
  HttpCode, 
  Post, 
} from '@nestjs/common'
import {
  CreateCompletionsDto, 
} from '@/dto/completions.dto'
import {
  OllamaService, 
} from '@/services/ollama.service'

/**
 * export class CreateCompletionsDto {
 *   message: string
 * }
 */
@Controller()
export class CompletionsController  {
  constructor(private readonly ollamaService: OllamaService) {}
  @Post()
  @HttpCode(201)
  ollamaChat(@Body() dto: CreateCompletionsDto) {
    return this.ollamaService.chat(dto.message)
  }
}
