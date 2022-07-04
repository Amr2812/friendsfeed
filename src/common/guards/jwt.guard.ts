import { Reflector } from "@nestjs/core";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    return (
      this.reflector.getAllAndOverride("public", [
        context.getHandler(),
        context.getClass()
      ]) || (super.canActivate(context) as boolean)
    );
  }
}
