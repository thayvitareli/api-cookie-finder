import { GetPostByIdUseCase } from './get-post-by-id.use-case';
import { IPostRepository } from '../domain/repository/post.repository.interface';
import { Post } from '../domain/model/post.model';
import { NotFoundException } from '@nestjs/common';

describe('GetPostByIdUseCase', () => {
  const findById = jest.fn();

  const repository: IPostRepository = {
    create: jest.fn() as any,
    findById: findById as any,
    findAll: jest.fn() as any,
    findAllTags: jest.fn() as any,
  };

  const useCase = new GetPostByIdUseCase(repository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a post when found', async () => {
    const postData = new Post({
      id: 'post-1',
      user_id: 'user-1',
      title: 'Test Post',
      content: 'Test content',
      author: {
        id: 'user-1',
        name: 'John Doe',
        avatar: 'avatar-url',
      },
    });

    findById.mockResolvedValue(postData);

    const result = await useCase.execute('post-1');

    expect(result).toBeInstanceOf(Post);
    expect(result.id).toBe('post-1');
    expect(result.author?.name).toBe('John Doe');
    expect(findById).toHaveBeenCalledWith('post-1');
  });

  it('should throw NotFoundException when post is not found', async () => {
    findById.mockResolvedValue(null);

    await expect(useCase.execute('invalid-id')).rejects.toThrow(NotFoundException);
    expect(findById).toHaveBeenCalledWith('invalid-id');
  });
});
