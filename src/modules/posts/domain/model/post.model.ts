export class Post {
  id?: string;
  user_id: string;
  title: string;
  content: string;
  image_uri?: string;
  tags?: string[];
  saved_posts?: any[];
  created_at?: Date;
  updated_at?: Date;

  author?: {
    id: string;
    name: string;
    avatar: string | null;
  };

  constructor(props: Post) {
    Object.assign(this, props);
  }
}
