import { ListPostCommentsUseCase } from './list-post-comments.use-case';
import { IPostRepository } from '../domain/repository/post.repository.interface';
import { PostComment } from '../domain/model/post-comment.model';

describe('ListPostCommentsUseCase', () => {
  const findCommentsByPostId = jest.fn();

  const repository: IPostRepository = {
    create: jest.fn() as any,
    findById: jest.fn() as any,
    findAll: jest.fn() as any,
    findAllTags: jest.fn() as any,
    createComment: jest.fn() as any,
    findCommentsByPostId: findCommentsByPostId as any,
    findSavedPostsByUserId: jest.fn() as any,
    countSavedPostsByUserId: jest.fn() as any,
  };

  const useCase = new ListPostCommentsUseCase(repository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list post comments with pagination', async () => {
    const comments = [
      new PostComment({
        id: 'c1',
        content: 'Comment 1',
        post_id: 'p1',
        user_id: 'u1',
        author: {
          id: 'u1',
          name: 'User 1',
          avatar: null,
        },
      }),
    ];

    findCommentsByPostId.mockResolvedValue({
      total: 10,
      records: comments,
    });

    const result = await useCase.execute({
      postId: 'p1',
      skip: 0,
      take: 10,
    });

    expect(findCommentsByPostId).toHaveBeenCalledWith('p1', {
      skip: 0,
      take: 10,
    });

    expect(result.total).toBe(10);
    expect(result.records).toHaveLength(1);
    expect(result.records[0].content).toBe('Comment 1');
  });
});
