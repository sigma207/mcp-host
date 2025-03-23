import {
  Injectable,
} from '@nestjs/common'
import ollama, {
  type Message,
} from 'ollama'
@Injectable()
export class OllamaService {
  async chat(messages: Message[]) {
    const response = await ollama.chat({
      messages,
      model: 'llama3.1:latest',
      stream: true,
    })

    return response
  }
}
