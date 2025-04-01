import {
  Injectable, 
} from '@nestjs/common'
import {
  Ollama, type Message, type Tool, 
} from 'ollama'

const LLM_NUM_CTX = 4096
const TOOL_COOL_MODEL = 'qwen2.5:14b'
const RESPONSE_MODEL = 'llama3.1:latest'

@Injectable()
export class OllamaService {
  private ollama: Ollama
  constructor() {
    this.ollama = new Ollama({
      host: 'http://10.137.2.13:11434',
    })
  }
  async chat(messages: Message[]) {
    const response = await this.ollama.chat({
      messages,
      model: RESPONSE_MODEL,
      options: {
        num_ctx: LLM_NUM_CTX,
      },
      stream: true,
    })
    return response
  }
  async chatWithTools(messages: Message[], queryResults: string[] = [], tools: Tool[] = []) {
    const lastContent = messages[messages.length - 1].content
    const replacedMessages = messages.slice(0, messages.length - 2)
    const toolMessageContent = `
      ${lastContent}
      Using these json: ${queryResults.join('\n')}
      `
    replacedMessages.push({
      role: 'user',
      content: toolMessageContent,
    })
    const response = await this.ollama.chat({
      messages: replacedMessages,
      model: TOOL_COOL_MODEL,
      options: {
        num_ctx: LLM_NUM_CTX,
      },
      stream: false,
      tools,
    })
    return response
  }
  async finishChat(message: string, toolResults: string[] = []) {
    const finalResponse = await this.ollama.generate({
      model: RESPONSE_MODEL,
      prompt: `Using this data: ${toolResults.join(',')}. Respond to this prompt: ${message}. Don't respond with any coding or code-like content. And don't respond with any data including id from database.`,
      options: {
        num_ctx: LLM_NUM_CTX,
      },
      stream: true,
    })
    return finalResponse
  }
}
