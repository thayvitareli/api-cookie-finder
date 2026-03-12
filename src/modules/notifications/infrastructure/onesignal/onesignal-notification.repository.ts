import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import IExternalNotificationRepository from '../../domain/repository/external-notification.repository';
import { Notification } from '../../domain/model/notification.model';

@Injectable()
export class OneSignalNotificationRepository implements IExternalNotificationRepository {
  private readonly logger = new Logger(OneSignalNotificationRepository.name);
  private readonly oneSignalAppId: string;
  private readonly oneSignalRestApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.oneSignalAppId = this.configService.get<string>('ONESIGNAL_APP_ID');
    this.oneSignalRestApiKey = this.configService.get<string>('ONESIGNAL_REST_API_KEY');
  }

  async sendPushNotification(notification: Notification, externalUserId: string): Promise<void> {
    try {
      if (!this.oneSignalAppId || !this.oneSignalRestApiKey) {
        this.logger.warn('OneSignal credentials not configured. Skipping push notification.');
        return;
      }

      await axios.post(
        'https://onesignal.com/api/v1/notifications',
        {
          app_id: this.oneSignalAppId,
          include_external_user_ids: [externalUserId],
          headings: { en: notification.title },
          contents: { en: notification.message },
          url: notification.link,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${this.oneSignalRestApiKey}`,
          },
        },
      );
      this.logger.log(`Push notification sent to external user ${externalUserId}`);
    } catch (error) {
      this.logger.error(
        `Failed to send push notification to ${externalUserId}`,
        error.message,
      );
    }
  }
}
