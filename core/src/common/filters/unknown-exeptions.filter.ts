import {
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

@Catch()
export class UnknownExceptionsFilter extends BaseExceptionFilter {
  private logger = new Logger("UnknownExceptionsFilter");

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Code: ${httpStatus} - Method: ${req.method} - URL: ${req.url}
         - Exception: ${JSON.stringify(exception)}`
      );
    }

    super.catch(exception, host);
  }
}
