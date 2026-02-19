import { Post } from '../model/post.model';

export interface IPostRepository {
  create(post: Post): Promise<void>;
  findById(id: string): Promise<Post | null>;
  // Add other methods as needed later
}
