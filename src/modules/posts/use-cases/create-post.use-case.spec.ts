import type { Express } from 'express';
import { Post } from '../domain/model/post.model';
import { CreatePostUseCase } from './create-post.use-case';
import { IPostRepository } from '../domain/repository/post.repository.interface';
import { IStorageProvider } from '../../storage/domain/provider/storage.provider.interface';

describe('CreatePostUseCase', () => {
  const create = jest.fn();
  const uploadImage = jest.fn();

  const repository: IPostRepository = {
    create: create as any,
    findById: jest.fn() as any,
  };

  const storage: IStorageProvider = {
    uploadImage: uploadImage as any,
    getImageUrl: jest.fn() as any,
    downloadImage: jest.fn() as any,
  };

  const useCase = new CreatePostUseCase(repository, storage);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a post without a file', async () => {
    const request = {
      user_id: 'user-1',
      title: 'Post Title',
      content: 'Post Content',
      tags: ['tag1', 'tag2'],
    };

    await useCase.execute(request);

    expect(uploadImage).not.toHaveBeenCalled();
    expect(create).toHaveBeenCalledTimes(1);
    
    const savedPost = (create.mock.calls[0] as [Post])[0];
    expect(savedPost.user_id).toBe('user-1');
    expect(savedPost.title).toBe('Post Title');
    expect(savedPost.content).toBe('Post Content');
    expect(savedPost.tags).toEqual(['tag1', 'tag2']);
  });

  it('should upload image when file is provided and persist post', async () => {
    uploadImage.mockResolvedValue({ path: 'posts/img-1', url: 'http://storage.com/img-1' });

    const file = {
      buffer: Buffer.from('fake-image'),
      originalname: 'photo.jpg',
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    const request = {
      user_id: 'user-1',
      title: 'Post with Image',
      content: 'Content with image',
      file,
    };

    await useCase.execute(request);

    expect(uploadImage).toHaveBeenCalledWith({
      buffer: file.buffer,
      filename: file.originalname,
      contentType: file.mimetype,
      folder: 'posts',
      makePublic: true,
    });

    expect(create).toHaveBeenCalledTimes(1);
    const savedPost = (create.mock.calls[0] as [Post])[0];
    expect(savedPost.image_uri).toBe('http://storage.com/img-1');
    expect(savedPost.title).toBe('Post with Image');
  });
});
