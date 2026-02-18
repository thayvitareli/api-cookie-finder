import { Module } from '@nestjs/common';
import { NotificationsController } from './presentation/controller/notifications.controller';
import { ListUserNotificationsUseCase } from './use-cases/list-user-notifications.use-case';
import { NotificationRepository } from '../../prisma/repositories/notification/notification.repository';
import { DatabaseModule } from '../../prisma/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationsController],
  providers: [
    ListUserNotificationsUseCase,
    {
      provide: 'INotificationRepository',
      useExisting: NotificationRepository,
    },
  ],
})
export class NotificationsModule {}
