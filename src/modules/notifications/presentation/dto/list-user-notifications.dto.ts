import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { Notification } from '../../domain/model/notification.model';

export class ListUserNotificationsRequest {
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  skip?: number = 0;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  take?: number = 10;
}

export class ListUserNotificationsResponse {
  total: number;
  records: Notification[];
}
