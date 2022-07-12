import { Reflector } from "@nestjs/core";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    if (req.cookies.access_token) {
      return super.canActivate(context) as boolean;
    }

    return (
      this.reflector.getAllAndOverride("public", [
        context.getHandler(),
        context.getClass()
      ]) || (super.canActivate(context) as boolean)
    );
  }
}
