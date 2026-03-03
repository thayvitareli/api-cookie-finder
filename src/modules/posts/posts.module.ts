import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../prisma/database.module';
import { StorageModule } from '../storage/storage.module';
import { PostRepository } from '../../prisma/repositories/post/post.repository';
import { CreatePostUseCase } from './use-cases/create-post.use-case';
import { ListPostsUseCase } from './use-cases/list-posts.use-case';
import { ListPostTagsUseCase } from './use-cases/list-post-tags.use-case';
import { GetPostByIdUseCase } from './use-cases/get-post-by-id.use-case';
import { CreatePostCommentUseCase } from './use-cases/create-comment.use-case';
import { ListPostCommentsUseCase } from './use-cases/list-post-comments.use-case';
import { ListSavedPostsUseCase } from './use-cases/list-saved-posts.use-case';
import { SavePostUseCase } from './use-cases/save-post.use-case';
import { UnsavePostUseCase } from './use-cases/unsave-post.use-case';
import { PostsController } from './presentation/controller/posts.controller';

@Module({
  controllers: [PostsController],
  imports: [DatabaseModule, StorageModule],
  providers: [
    CreatePostUseCase,
    ListPostsUseCase,
    ListPostTagsUseCase,
    GetPostByIdUseCase,
    CreatePostCommentUseCase,
    ListPostCommentsUseCase,
    ListSavedPostsUseCase,
    SavePostUseCase,
    UnsavePostUseCase,
    {
      provide: 'IPostRepository',
      useExisting: PostRepository,
    },
  ],
})
export class PostsModule {}
