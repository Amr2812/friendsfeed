import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationsService } from "./notifications.service";
import { NotificationRepository } from "./notitification.repository";

@Module({
  imports: [TypeOrmModule.forFeature([NotificationRepository])],
  providers: [NotificationsService],
  exports: [NotificationsService]
})
export class NotificationsModule {}
