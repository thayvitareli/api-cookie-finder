import { BaseEntity } from "src/shared/entity/base-entity";


export class Recipe extends BaseEntity {
  public name: string;
  public ingredients: any; 
  public instructions: string;
  public image_uri?: string;
  public video_uri?: string;
  public user_id: string;
  public category_id: string;

  constructor(props: {
    id?: string;
    name: string;
    ingredients: any;
    instructions: string;
    user_id: string;
    category_id: string;
    image_uri?: string;
    video_uri?: string;
    created_at?: Date;
  }) {
    super({ id: props.id, created_at: props.created_at });
    this.name = props.name;
    this.ingredients = props.ingredients;
    this.instructions = props.instructions;
    this.image_uri = props.image_uri;
    this.video_uri = props.video_uri;
    this.user_id = props.user_id;
    this.category_id = props.category_id;
  }


  public updateName(newName: string) {
    if (!newName || newName.trim().length < 3) {
      throw new Error("O nome da receita deve ter pelo menos 3 caracteres.");
    }
    this.name = newName;
  }

  public updateInstructions(newInstructions: string) {
    this.instructions = newInstructions;
  }
}
