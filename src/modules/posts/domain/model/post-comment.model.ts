export class PostComment {
  id?: string;
  content: string;
  user_id: string;
  post_id: string;
  author?: {
    id: string;
    name: string;
    avatar: string | null;
  };
  created_at?: Date;

  constructor(props: PostComment) {
    Object.assign(this, props);
  }
}
