import {
  ChatResponse,
} from 'ollama'
export interface ServerToClientEvents {
  ollamaStreamResponse: (response: ChatResponse) => void,
}
