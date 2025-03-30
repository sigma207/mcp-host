import {
  Injectable, NestMiddleware, Logger,
} from '@nestjs/common'
import {
  NextFunction, Request, Response,
} from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware{
  logger = new Logger(LoggerMiddleware.name)
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`Request: ${req.method} ${req.baseUrl}`)
    if (req.body) {
      this.logger.log(req.body)
    }
    next()
  }
}