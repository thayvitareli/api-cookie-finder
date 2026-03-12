import { Notification } from "../model/notification.model";

export default interface IExternalNotificationRepository {
  sendPushNotification(notification: Notification, externalUserId: string): Promise<void>;
}
