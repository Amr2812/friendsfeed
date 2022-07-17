import { AuthGuard } from "@nestjs/passport";

export class RefreshJwtGuard extends AuthGuard("refresh-jwt") {
  constructor() {
    super();
  }
}
