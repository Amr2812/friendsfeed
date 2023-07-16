import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { RmqAckBadReqExceptionsFilter } from "./common/filters";
import { rabbitmqConfig } from "./config";

async function bootstrap() {
  const logger = new Logger("bootstrap");
  const rabbitmqOptions = rabbitmqConfig();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqConfig().uri],
        queue: rabbitmqOptions.queue,
        noAck: false,
        queueOptions: { durable: true }
      }
    }
  );

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new RmqAckBadReqExceptionsFilter());

  await app.listen();
  logger.log("Microservice is listening on rabbitmq transport...");
}
bootstrap();
