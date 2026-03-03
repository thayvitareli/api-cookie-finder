import { Body, Controller, Post, Get, Query, UseGuards, Request, UseInterceptors, UploadedFile, Param, Delete } from '@nestjs/common';
import { CreatePostUseCase } from '../../use-cases/create-post.use-case';
import { ListPostsUseCase } from '../../use-cases/list-posts.use-case';
import { ListPostTagsUseCase } from '../../use-cases/list-post-tags.use-case';
import { JwtAuthGuard } from '../../../auth/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from '../dto/create-post.dto';
import { GetPostByIdUseCase } from '../../use-cases/get-post-by-id.use-case';
import { CreatePostCommentUseCase } from '../../use-cases/create-comment.use-case';
import { ListPostCommentsUseCase } from '../../use-cases/list-post-comments.use-case';
import { ListSavedPostsUseCase } from '../../use-cases/list-saved-posts.use-case';
import { SavePostUseCase } from '../../use-cases/save-post.use-case';
import { UnsavePostUseCase } from '../../use-cases/unsave-post.use-case';
import { CreatePostCommentDto } from '../dto/create-post-comment.dto';
import { Public } from '../../../../shared/decorator/public.decorator';
import { FindManySharedDto } from 'src/shared/dto/find-many.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private createPostUseCase: CreatePostUseCase,
    private listPostsUseCase: ListPostsUseCase,
    private listPostTagsUseCase: ListPostTagsUseCase,
    private getPostByIdUseCase: GetPostByIdUseCase,
    private createPostCommentUseCase: CreatePostCommentUseCase,
    private listPostCommentsUseCase: ListPostCommentsUseCase,
    private listSavedPostsUseCase: ListSavedPostsUseCase,
    private savePostUseCase: SavePostUseCase,
    private unsavePostUseCase: UnsavePostUseCase,
  ) {}

  @Get('saved')
  @UseGuards(JwtAuthGuard)
  async listSaved(
    @Request() req: any,
   @Query() query: FindManySharedDto
  ) {
    const user_id = req.user.userId;

    return this.listSavedPostsUseCase.execute({
      user_id,
      ...query,
    });
  }

  @Get('tags')
  async listTags() {
    return this.listPostTagsUseCase.execute();
  }

  @Get()
  async findAll(
    @Request() req: any,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('tag_ids') tag_ids?: string | string[],
  ) {
    const tagIdsArray = typeof tag_ids === 'string' ? tag_ids.split(',') : tag_ids;
    const user_id = req.user?.userId;

    return this.listPostsUseCase.execute({
      skip,
      take,
      tag_ids: tagIdsArray,
      user_id,
    });
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string, @Request() req: any) {
    const user_id = req.user?.userId;
    return this.getPostByIdUseCase.execute(id, user_id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() body: CreatePostDto,
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { title, content, image_uri, tags } = body;
    const user_id = req.user.userId;

    const post = await this.createPostUseCase.execute({
      user_id,
      title,
      content,
      tags,
      file,
      image_uri,
    });

    return { 
      message: 'Post created successfully',
      post,
    };
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('id') id: string,
    @Body() body: CreatePostCommentDto,
    @Request() req: any,
  ) {
    const user_id = req.user.userId;
    const { content } = body;

    const comment = await this.createPostCommentUseCase.execute({
      postId: id,
      userId: user_id,
      content,
    });

    return {
      message: 'Comment created successfully',
      comment,
    };
  }

  @Public()
  @Get(':id/comments')
  async listComments(
    @Param('id') id: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.listPostCommentsUseCase.execute({
      postId: id,
      skip,
      take,
    });
  }

  @Post(':id/save')
  @UseGuards(JwtAuthGuard)
  async save(@Param('id') id: string, @Request() req: any) {
    const user_id = req.user.userId;

    await this.savePostUseCase.execute(id, user_id);

    return {
      message: 'Post saved successfully',
    };
  }

  @Delete(':id/save')
  @UseGuards(JwtAuthGuard)
  async unsave(@Param('id') id: string, @Request() req: any) {
    const user_id = req.user.userId;

    await this.unsavePostUseCase.execute(id, user_id);

    return {
      message: 'Post unsaved successfully',
    };
  }
}
