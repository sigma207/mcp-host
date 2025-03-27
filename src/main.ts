import {
  NestFactory,
} from '@nestjs/core'
import {
  SwaggerModule, DocumentBuilder,
} from '@nestjs/swagger'
import {
  AppModule,
} from './app.module'
import {
  ConsoleLogger,
} from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: true,
      colors: true,
    }),
  })
  const config = new DocumentBuilder()
    .setTitle('Mcp Host')
    .setDescription('The MCP host API description')
    .setVersion('1.0')
    .addTag('mcp')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
