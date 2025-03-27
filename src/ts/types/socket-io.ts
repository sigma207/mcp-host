import {
  ChatResponse,
  GenerateResponse,
} from 'ollama'
export interface ServerToClientEvents {
  ollamaStreamResponse: (response: ChatResponse | GenerateResponse) => void,
}
