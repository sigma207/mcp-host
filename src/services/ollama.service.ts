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
    for await (const part of response) {
      process.stdout.write(part.message.content)
    }
  }
}
