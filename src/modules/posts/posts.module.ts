import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../prisma/database.module';
import { StorageModule } from '../storage/storage.module';
import { PostRepository } from '../../prisma/repositories/post/post.repository';
import { CreatePostUseCase } from './use-cases/create-post.use-case';
import { ListPostsUseCase } from './use-cases/list-posts.use-case';
import { ListPostTagsUseCase } from './use-cases/list-post-tags.use-case';
import { PostsController } from './presentation/controller/posts.controller';

@Module({
  controllers: [PostsController],
  imports: [DatabaseModule, StorageModule],
  providers: [
    CreatePostUseCase,
    ListPostsUseCase,
    ListPostTagsUseCase,
    {
      provide: 'IPostRepository',
      useExisting: PostRepository,
    },
  ],
})
export class PostsModule {}
