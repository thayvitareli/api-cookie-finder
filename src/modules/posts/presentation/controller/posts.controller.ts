import { Body, Controller, Post, Get, Query, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CreatePostUseCase } from '../../use-cases/create-post.use-case';
import { ListPostsUseCase } from '../../use-cases/list-posts.use-case';
import { ListPostTagsUseCase } from '../../use-cases/list-post-tags.use-case';
import { JwtAuthGuard } from '../../../auth/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from '../dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private createPostUseCase: CreatePostUseCase,
    private listPostsUseCase: ListPostsUseCase,
    private listPostTagsUseCase: ListPostTagsUseCase,
  ) {}

  @Get('tags')
  async listTags() {
    return this.listPostTagsUseCase.execute();
  }

  @Get()
  async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('tag_ids') tag_ids?: string | string[],
  ) {
    const tagIdsArray = typeof tag_ids === 'string' ? tag_ids.split(',') : tag_ids;

    return this.listPostsUseCase.execute({
      skip,
      take,
      tag_ids: tagIdsArray,
    });
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
}
