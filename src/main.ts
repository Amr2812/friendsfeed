import "module-alias/register";
import { NestFactory, HttpAdapterHost } from "@nestjs/core";
import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
  Logger
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";
import { ValidationError } from "class-validator";
import { UnknownExceptionsFilter } from "@common/filters";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const { httpAdapter } = app.get(HttpAdapterHost);
  const defaultVersion = configService.get("DEFAULT_VERSION") || "1.0";

  app.setGlobalPrefix("api");
  app.enableVersioning({
    defaultVersion,
    type: VersioningType.URI
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      validationError: {
        target: false,
        value: true
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(validationErrors);
      }
    })
  );
  app.useGlobalFilters(new UnknownExceptionsFilter(httpAdapter));
  app.enableCors({
    origin: configService.get("CORS_ORIGIN")
  });

  app.use(
    cookieParser(configService.get("COOKIE_SECRET"), {
      secure: true,
      httpOnly: true,
      signed: true
    } as any)
  );
  app.use(helmet());

  const swaggerConfig = new DocumentBuilder()
    .setTitle("NestJs JWT Auth")
    .setDescription(
      "Easy Connect is a social network Rest API built with NestJs"
    )
    .setVersion("1.0")
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`api/v${defaultVersion}/docs`, app, swaggerDocument);
  logger.log(`Swagger docs is available at api/v${defaultVersion}/docs`);

  const port = configService.get("PORT");
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
