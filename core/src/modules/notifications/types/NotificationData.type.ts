import { ExcludeMethods } from "@common/types";
import { Notification } from "../Notification.entity";

export type NotificationData = ExcludeMethods<Notification>;
