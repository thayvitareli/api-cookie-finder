import { ListPostsUseCase } from './list-posts.use-case';
import { IPostRepository } from '../domain/repository/post.repository.interface';
import { IStorageProvider } from '../../storage/domain/provider/storage.provider.interface';
import { Post } from '../domain/model/post.model';

describe('ListPostsUseCase', () => {
  const findAll = jest.fn();
  const getImageUrl = jest.fn();

  const repository: IPostRepository = {
    create: jest.fn() as any,
    findById: jest.fn() as any,
    findAll: findAll as any,
    findAllTags: jest.fn() as any,
    createComment: jest.fn() as any,
    findCommentsByPostId: jest.fn() as any,
    findSavedPostsByUserId: jest.fn() as any,
    countSavedPostsByUserId: jest.fn() as any,
    save: jest.fn() as any,
    unsave: jest.fn() as any,
  };

  const storage: IStorageProvider = {
    uploadImage: jest.fn() as any,
    getImageUrl: getImageUrl as any,
    downloadImage: jest.fn() as any,
  };

  const useCase = new ListPostsUseCase(repository, storage);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list posts with pagination and tags', async () => {
    const posts = [
      new Post({
        id: '1',
        user_id: 'u1',
        title: 'Title 1',
        content: 'Content 1',
        image_uri: 'posts/img1.jpg',
        tags: ['tag1'],
      }),
    ];

    findAll.mockResolvedValue({
      total: 10,
      records: posts,
    });

    getImageUrl.mockResolvedValue('http://cdn.com/posts/img1.jpg');

    const result = await useCase.execute({
      skip: 0,
      take: 10,
      tag_ids: ['tag1'],
    });

    expect(findAll).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      tag_ids: ['tag1'],
      userId: undefined,
    });

    expect(getImageUrl).toHaveBeenCalledWith('posts/img1.jpg');
    expect(result.total).toBe(10);
    expect(result.records[0].image_uri).toBe('http://cdn.com/posts/img1.jpg');
  });

  it('should list posts with is_saved status when user_id is provided', async () => {
    const posts = [
      new Post({
        id: '1',
        user_id: 'u1',
        title: 'Title 1',
        content: 'Content 1',
        is_saved: true,
      }),
    ];

    findAll.mockResolvedValue({
      total: 1,
      records: posts,
    });

    const result = await useCase.execute({
      user_id: 'user-123',
    });

    expect(findAll).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'user-123',
    }));
    expect(result.records[0].is_saved).toBe(true);
  });

  it('should not call getImageUrl if image_uri is already a full URL', async () => {
    const posts = [
      new Post({
        id: '1',
        user_id: 'u1',
        title: 'Title 1',
        content: 'Content 1',
        image_uri: 'http://external.com/img1.jpg',
      }),
    ];

    findAll.mockResolvedValue({
      total: 1,
      records: posts,
    });

    const result = await useCase.execute({});

    expect(getImageUrl).not.toHaveBeenCalled();
    expect(result.records[0].image_uri).toBe('http://external.com/img1.jpg');
  });
});
