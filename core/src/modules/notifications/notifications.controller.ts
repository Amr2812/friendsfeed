import { GetUser } from "@common/decorators";
import { ValidateResDtoInterceptor } from "@common/interceptors/validate-res-dto.interceptor";
import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  GetNotificationsQueryDto,
  GetNotificationsResDto,
  GetUnreadNotificationsCountResDto
} from "./dto";
import { NotificationsService } from "./notifications.service";

@ApiTags("Notifications")
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseInterceptors(new ValidateResDtoInterceptor(GetNotificationsResDto))
  getNotifications(
    @GetUser("id") userId: number,
    @Query() query: GetNotificationsQueryDto
  ) {
    return this.notificationsService.getNotifications(userId, query);
  }

  @Get("unread-count")
  @UseInterceptors(
    new ValidateResDtoInterceptor(GetUnreadNotificationsCountResDto)
  )
  getUnreadNotificationsCount(@GetUser("id") userId: number) {
    return this.notificationsService.getUnreadNotificationsCount(userId);
  }
}
