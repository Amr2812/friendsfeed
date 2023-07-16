import { Catch, ArgumentsHost, BadRequestException } from "@nestjs/common";
import { BaseRpcExceptionFilter, RmqContext } from "@nestjs/microservices";

@Catch()
export class RmqAckBadReqExceptionsFilter extends BaseRpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (exception instanceof BadRequestException) {
      const ctx: RmqContext = host.switchToRpc().getContext();
      ctx.getChannelRef().ack(ctx.getMessage())
    }
    return super.catch(exception, host);
  }
}
