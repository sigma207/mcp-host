import {
  Injectable,
} from '@nestjs/common'
import ollama from 'ollama'
@Injectable()
export class OllamaService {
  async chat(message: string) {
    const messages = [{
      role: 'user',
      content: message,
    }]
    const response = await ollama.chat({
      messages,
      model: 'llama3.1:latest',
      stream: true,
    })

    return response
  }
}
