import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ReqUser } from "@common/types";

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): ReqUser => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  }
);
