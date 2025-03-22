import {
  Controller, Get, 
} from '@nestjs/common'

@Controller()
export class CompletionsController  {
  @Get()
  getHello(): string {
    return 'Hello completions!'
  }
}
