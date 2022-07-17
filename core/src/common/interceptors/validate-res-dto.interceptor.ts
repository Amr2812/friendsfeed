import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
  Type
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class ValidateResDtoInterceptor<T extends object>
  implements NestInterceptor
{
  private logger = new Logger("ValidateResDtoInterceptor");
  private validationOptions = {
    validationError: { target: false, value: true },
    whitelist: true
  };

  constructor(private readonly dto: Type<T>) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map(async (data: T) => {
        const validationErrors = await (data instanceof this.dto
          ? validate(data, this.validationOptions)
          : validate(plainToInstance(this.dto, data), this.validationOptions));

        if (validationErrors.length > 0) {
          this.logger.error(
            `Validation errors: ${JSON.stringify(validationErrors)}`,
            context.getClass().name
          );

          throw new InternalServerErrorException(validationErrors);
        }

        return data;
      })
    );
  }
}
