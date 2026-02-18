import { Inject, Injectable } from '@nestjs/common';
import INotificationRepository from '../domain/repository/notification.repository';
import {
  ListUserNotificationsRequest,
  ListUserNotificationsResponse,
} from '../presentation/dto/list-user-notifications.dto';

@Injectable()
export class ListUserNotificationsUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(
    userId: string,
    query: ListUserNotificationsRequest,
  ): Promise<ListUserNotificationsResponse> {
    const { skip, take } = query;

    const [notifications, total] = await Promise.all([
      this.notificationRepository.findMany(userId, skip, take),
      this.notificationRepository.total(userId),
    ]);

    return {
      total,
      records: notifications,
    };
  }
}
