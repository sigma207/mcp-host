import {
  Module, 
} from '@nestjs/common'
import {
  CompletionsController, 
} from './completions.controller'

@Module({
  controllers: [CompletionsController],
})
export class CompletionsModule {}