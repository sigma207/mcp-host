import {
  Module, 
} from '@nestjs/common'
import {
  CompletionsController, 
} from './completions.controller'
import {
  OllamaService, 
} from '@/services/ollama.service'

@Module({
  providers: [OllamaService],
  controllers: [CompletionsController],
})
export class CompletionsModule {}