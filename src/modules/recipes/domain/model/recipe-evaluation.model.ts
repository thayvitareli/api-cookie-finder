import { BaseEntity } from '../../../../shared/entity/base-entity';

export class RecipeEvaluation extends BaseEntity {
  public stars: number;
  public comment: string;
  public user_id: string;
  public recipe_id: string;
  public user_name?: string;
  public user_avatar?: string;

  constructor(props: {
    id?: string;
    stars: number;
    comment: string;
    user_id: string;
    recipe_id: string;
    user_name?: string;
    user_avatar?: string;
    created_at?: Date;
  }) {
    super({ id: props.id, created_at: props.created_at });
    this.stars = props.stars;
    this.comment = props.comment;
    this.user_id = props.user_id;
    this.recipe_id = props.recipe_id;
    this.user_name = props.user_name;
    this.user_avatar = props.user_avatar;
  }
}
