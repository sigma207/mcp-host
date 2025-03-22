import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { V1Module } from './api/v1/v1.module';
import { ChatModule } from './api/v1/chat/chat.module';
import { CompletionsModule } from './api/v1/chat/completions/completions.module';
@Module({
  imports: [
    ApiModule,
    RouterModule.register([
      {
        path: 'api',
        module: ApiModule,
        children: [
          {
            path: 'v1',
            module: V1Module,
            children: [
              {
                path: 'chat',
                module: ChatModule,
                children: [
                  {
                    path: 'completions',
                    module: CompletionsModule,
                  },
                ],
              },
            ],
          },
        ],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
