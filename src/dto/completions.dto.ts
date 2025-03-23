import {
  ApiProperty, 
} from '@nestjs/swagger'
export class CreateCompletionsDto {
  @ApiProperty({
    type: 'string',
    example: 'What is the capital of Taiwan?',
    description: 'The message to send to the model',
  })
  message: string
}