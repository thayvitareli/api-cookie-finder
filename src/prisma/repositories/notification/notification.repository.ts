import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import INotificationRepository from '../../../modules/notifications/domain/repository/notification.repository';
import { Notification } from '../../../modules/notifications/domain/model/notification.model';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(private prisma: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    await this.prisma.notification.create({
      data: {
        id: notification.id,
        user_id: notification.userId,
        title: notification.title,
        message: notification.message,
        link: notification.link,
        read_at: notification.readAt,
        created_at: notification.created_at,
      },
    });
  }

  async findMany(
    userId: string,
    skip = 0,
    take = 10,
  ): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { user_id: userId },
      skip,
      take,
      orderBy: { created_at: 'desc' },
    });

    return notifications.map((n) => this.toDomain(n));
  }

  async total(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { user_id: userId },
    });
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) return null;

    return this.toDomain(notification);
  }

  async update(notification: Notification): Promise<void> {
    await this.prisma.notification.update({
      where: { id: notification.id },
      data: {
        title: notification.title,
        message: notification.message,
        link: notification.link,
        read_at: notification.readAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.notification.delete({
      where: { id },
    });
  }

  private toDomain(n: any): Notification {
    return new Notification({
      id: n.id,
      userId: n.user_id,
      title: n.title,
      message: n.message,
      link: n.link,
      readAt: n.read_at,
      created_at: n.created_at,
    });
  }
}
