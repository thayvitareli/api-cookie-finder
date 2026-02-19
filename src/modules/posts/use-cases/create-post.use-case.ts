import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository } from '../domain/repository/post.repository.interface';
import { Post } from '../domain/model/post.model';
import { IStorageProvider } from '../../storage/domain/provider/storage.provider.interface';

interface CreatePostRequest {
  user_id: string;
  title: string;
  content: string;
  image_uri?: string;
  tags?: string[];
  file?: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
  };
}

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
    @Inject('IStorageProvider')
    private readonly storageProvider: IStorageProvider,
  ) {}

  async execute(request: CreatePostRequest): Promise<void> {
    let imageUri = request.image_uri;

    if (request.file) {
      const upload = await this.storageProvider.uploadImage({
        buffer: request.file.buffer,
        filename: request.file.originalname,
        contentType: request.file.mimetype,
        folder: 'posts',
        makePublic: true,
      });
      imageUri = upload.url;
    }

    const post = new Post({
      user_id: request.user_id,
      title: request.title,
      content: request.content,
      image_uri: imageUri,
      tags: request.tags,
    });

    await this.postRepository.create(post);
  }
}
