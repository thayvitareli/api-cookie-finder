import { Notification } from "../model/notification.model";

export default interface INotificationRepository {
    create(notification: Notification): Promise<void>;
    findMany(userId: string): Promise<Notification[]>;
    findOne(id: string): Promise<Notification>;
    update(notification: Notification): Promise<void>;
    delete(id: string): Promise<void>;
}