import { UnsavePostUseCase } from './unsave-post.use-case';
import { IPostRepository } from '../domain/repository/post.repository.interface';

describe('UnsavePostUseCase', () => {
  const unsave = jest.fn();

  const repository: IPostRepository = {
    unsave,
  } as any;

  const useCase = new UnsavePostUseCase(repository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should unsave a post', async () => {
    const postId = 'post-1';
    const userId = 'user-1';

    await useCase.execute(postId, userId);

    expect(unsave).toHaveBeenCalledTimes(1);
    expect(unsave).toHaveBeenCalledWith(postId, userId);
  });
});
