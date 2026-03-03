import { PostComment } from '../model/post-comment.model';
import { PostTag } from '../model/post-tag.model';
import { Post } from '../model/post.model';

export interface FindAllPostsOutput {
  total: number;
  records: Post[];
}

export interface FindAllTagsOutput {
  total: number;
  records: PostTag[];
}

export interface IPostRepository {
  create(post: Post): Promise<Post>;
  findById(id: string): Promise<Post | null>;
  findAll(filters: {
    skip?: number;
    take?: number;
    tag_ids?: string[];
  }): Promise<FindAllPostsOutput>;
  findAllTags(): Promise<FindAllTagsOutput>;
  createComment(comment: PostComment): Promise<PostComment>;
  findCommentsByPostId(
    postId: string,
    filters: {
      skip?: number;
      take?: number;
    },
  ): Promise<{ total: number; records: PostComment[] }>;
  findSavedPostsByUserId(
    userId: string,
    filters: {
      skip?: number;
      take?: number;
    },
  ): Promise<Post[]>;
  countSavedPostsByUserId(userId: string): Promise<number>;
}
