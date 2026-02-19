export class Post {
  id?: string;
  user_id: string;
  title: string;
  content: string;
  image_uri?: string;
  tags?: string[];
  created_at?: Date;
  updated_at?: Date;

  constructor(props: Post) {
    Object.assign(this, props);
  }
}
