import { SavePostUseCase } from './save-post.use-case';
import { IPostRepository } from '../domain/repository/post.repository.interface';

describe('SavePostUseCase', () => {
  const save = jest.fn();

  const repository: IPostRepository = {
    save,
  } as any;

  const useCase = new SavePostUseCase(repository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save a post', async () => {
    const postId = 'post-1';
    const userId = 'user-1';

    await useCase.execute(postId, userId);

    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith(postId, userId);
  });
});
