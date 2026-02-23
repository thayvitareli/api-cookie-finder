import { Post } from '../model/post.model';

export interface FindAllPostsOutput {
  total: number;
  records: Post[];
}

export interface IPostRepository {
  create(post: Post): Promise<Post>;
  findById(id: string): Promise<Post | null>;
  findAll(filters: {
    skip?: number;
    take?: number;
    tag_ids?: string[];
  }): Promise<FindAllPostsOutput>;
}
