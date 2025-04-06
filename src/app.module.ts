import {
  Module,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common'
import {
  RouterModule,
} from '@nestjs/core'
import {
  ConfigModule,
} from '@nestjs/config'
import {
  AppController,
} from './app.controller'
import {
  AppService,
} from './app.service'
import {
  ApiModule,
} from './api/api.module'
import {
  EventsModule,
} from './events/events.module'
import {
  V1Module,
} from './api/v1/v1.module'
import {
  ChatModule,
} from './api/v1/chat/chat.module'
import {
  CompletionsModule,
} from './api/v1/chat/completions/completions.module'
import {
  McpCollectorModule,
} from './modules/mcp-collector/mcp-collector.module'
import {
  ChromaModule,
} from './modules/chroma/chroma.module'
import {
  LoggerMiddleware,
} from './middlewares/logger.middleware'
import {
  InitService,
} from './init.service'
@Module({
  imports: [
    EventsModule,
    ApiModule,
    McpCollectorModule,
    ChromaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local'],
    }),
    RouterModule.register([{
      path: 'api',
      module: ApiModule,
      children: [{
        path: 'v1',
        module: V1Module,
        children: [{
          path: 'chat',
          module: ChatModule,
          children: [{
            path: 'completions',
            module: CompletionsModule,
          }],
        }],
      }],
    }]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    InitService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
  }
}
