import { Body, Controller, Post, Get, Query, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CreatePostUseCase } from '../../use-cases/create-post.use-case';
import { ListPostsUseCase } from '../../use-cases/list-posts.use-case';
import { JwtAuthGuard } from '../../../auth/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(
    private createPostUseCase: CreatePostUseCase,
    private listPostsUseCase: ListPostsUseCase,
  ) {}

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
    @Body() body: any,
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { title, content } = body;
    let { tags } = body;

    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch {
        tags = tags.split(',').map((t: string) => t.trim());
      }
    }

    const user_id = req.user.id;

    await this.createPostUseCase.execute({
      user_id,
      title,
      content,
      tags,
      file,
    });

    return { message: 'Post created successfully' };
  }
}
