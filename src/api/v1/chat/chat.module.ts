import {
  Module, 
} from '@nestjs/common'
import {
  CompletionsModule, 
} from './completions/completions.module'

@Module({
  imports: [CompletionsModule],
})
export class ChatModule {}