import { Catch, ArgumentsHost, BadRequestException } from "@nestjs/common";
import { BaseRpcExceptionFilter } from "@nestjs/microservices";

@Catch()
export class RmqAckBadReqExceptionsFilter extends BaseRpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (exception instanceof BadRequestException) {
      const ctx = host.switchToRpc().getContext();
      ctx.getChannelRef().ack(ctx.getMessage());
    }
    return super.catch(exception, host);
  }
}
