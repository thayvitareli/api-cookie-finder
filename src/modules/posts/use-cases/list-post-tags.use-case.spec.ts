import { ListPostTagsUseCase } from './list-post-tags.use-case';
import { IPostRepository } from '../domain/repository/post.repository.interface';
import { PostTag } from '../domain/model/post-tag.model';

describe('ListPostTagsUseCase', () => {
  const findAllTags = jest.fn();

  const repository: IPostRepository = {
    create: jest.fn() as any,
    findById: jest.fn() as any,
    findAll: jest.fn() as any,
    findAllTags: findAllTags as any,
  };

  const useCase = new ListPostTagsUseCase(repository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list all post tags', async () => {
    const tags = [
      new PostTag({ id: '1', name: 'tag1' }),
      new PostTag({ id: '2', name: 'tag2' }),
    ];

    findAllTags.mockResolvedValue({
      total: 2,
      records: tags,
    });

    const result = await useCase.execute();

    expect(findAllTags).toHaveBeenCalledTimes(1);
    expect(result.total).toBe(2);
    expect(result.records).toEqual(tags);
  });
});
