import { ListSavedPostsUseCase } from './list-saved-posts.use-case';
import { IPostRepository } from '../domain/repository/post.repository.interface';
import { IStorageProvider } from '../../storage/domain/provider/storage.provider.interface';
import { Post } from '../domain/model/post.model';

describe('ListSavedPostsUseCase', () => {
  const countSavedPostsByUserId = jest.fn();
  const findSavedPostsByUserId = jest.fn();
  const getImageUrl = jest.fn();

  const repository: IPostRepository = {
    create: jest.fn() as any,
    findById: jest.fn() as any,
    findAll: jest.fn() as any,
    findAllTags: jest.fn() as any,
    createComment: jest.fn() as any,
    findCommentsByPostId: jest.fn() as any,
    findSavedPostsByUserId: findSavedPostsByUserId as any,
    countSavedPostsByUserId: countSavedPostsByUserId as any,
  };

  const storage: IStorageProvider = {
    uploadImage: jest.fn() as any,
    getImageUrl: getImageUrl as any,
    downloadImage: jest.fn() as any,
  };

  const useCase = new ListSavedPostsUseCase(repository, storage);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list saved posts of a user', async () => {
    const posts = [
      new Post({
        id: '1',
        user_id: 'u1',
        title: 'Saved Title 1',
        content: 'Content 1',
        image_uri: 'posts/img1.jpg',
        tags: ['tag1'],
      }),
    ];

    findSavedPostsByUserId.mockResolvedValue(posts);
    countSavedPostsByUserId.mockResolvedValue(1);

    getImageUrl.mockResolvedValue('http://cdn.com/posts/img1.jpg');

    const result = await useCase.execute({
      user_id: 'u1',
      skip: 0,
      take: 10,
    });

    expect(findSavedPostsByUserId).toHaveBeenCalledWith('u1', {
      skip: 0,
      take: 10,
    });

    expect(countSavedPostsByUserId).toHaveBeenCalledWith('u1');

    expect(getImageUrl).toHaveBeenCalledWith('posts/img1.jpg');
    expect(result.total).toBe(1);
    expect(result.records[0].image_uri).toBe('http://cdn.com/posts/img1.jpg');
  });
});
