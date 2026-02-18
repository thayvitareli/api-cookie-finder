import { Controller, Get, Query, Request } from '@nestjs/common';
import { ListUserNotificationsUseCase } from '../../use-cases/list-user-notifications.use-case';
import { ListUserNotificationsRequest } from '../dto/list-user-notifications.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly listUserNotificationsUseCase: ListUserNotificationsUseCase,
  ) {}

  @Get()
  findAll(@Query() query: ListUserNotificationsRequest, @Request() req) {
    return this.listUserNotificationsUseCase.execute(req.user.userId, query);
  }
}
