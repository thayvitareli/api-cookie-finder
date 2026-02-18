import { Module } from '@nestjs/common';
import { NotificationsController } from './presentation/controller/notifications.controller';

@Module({
  controllers: [NotificationsController],
})
export class NotificationsModule {}
