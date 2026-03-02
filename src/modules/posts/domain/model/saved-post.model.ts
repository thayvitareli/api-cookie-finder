export class SavedPost {
  post_id: string;
  user_id: string;
  created_at?: Date;

  constructor(props: SavedPost) {
    Object.assign(this, props);
  }
}
