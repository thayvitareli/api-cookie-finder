import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { IUserRepository } from '../../users/domain/repository/user.model.repository';
import INotificationRepository from '../../notifications/domain/repository/notification.repository';
import IExternalNotificationRepository from '../../notifications/domain/repository/external-notification.repository';
import { Notification } from '../../notifications/domain/model/notification.model';

interface NewRecipeJobData {
  recipeId: string;
  recipeName: string;
  authorId: string;
}

@Processor('recipe-notifications')
export class RecipeNotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(RecipeNotificationProcessor.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
    @Inject('IExternalNotificationRepository')
    private readonly externalNotificationRepository: IExternalNotificationRepository,
  ) {
    super();
  }

  async process(job: Job<NewRecipeJobData>): Promise<void> {
    const { recipeId, recipeName, authorId } = job.data;

    this.logger.log(
      `Processing new-recipe notification for recipe "${recipeName}" (${recipeId})`,
    );

    const followerIds = await this.userRepository.getFollowerIds(authorId);

    if (followerIds.length === 0) {
      this.logger.log(`Author ${authorId} has no followers. Skipping.`);
      return;
    }

    this.logger.log(
      `Notifying ${followerIds.length} followers of author ${authorId}`,
    );

    for (const followerId of followerIds) {
      try {
        const notification = new Notification({
          userId: followerId,
          title: 'Nova receita publicada!',
          message: `Uma nova receita "${recipeName}" foi publicada por alguém que você segue.`,
          link: `/recipes/${recipeId}`,
        });

        await this.notificationRepository.create(notification);

        await this.externalNotificationRepository.sendPushNotification(
          notification,
          followerId,
        );
      } catch (error) {
        this.logger.error(
          `Failed to notify follower ${followerId}: ${error.message}`,
        );
      }
    }

    this.logger.log(
      `Finished notifying followers for recipe "${recipeName}"`,
    );
  }
}
