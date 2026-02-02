import { BaseEntity } from 'src/shared/entity/base-entity';

export type Ingredient = {
  name: string;
  amount?: string;
  unit?: string;
  note?: string;
};

export type InstructionStep = {
  step: number;
  text: string;
  durationMin?: number;
};

export class Recipe extends BaseEntity {
  public name: string;
  public ingredients: Ingredient[];
  public instructions: InstructionStep[];
  public image_uri?: string;
  public video_uri?: string;
  public servings?: number;
  public prep_time_min?: number;
  public user_id: string;
  public category_id: string;

  constructor(props: {
    id?: string;
    name: string;
    ingredients: Ingredient[];
    instructions: InstructionStep[];
    user_id: string;
    category_id: string;
    image_uri?: string;
    video_uri?: string;
    servings?: number;
    prep_time_min?: number;
    created_at?: Date;
  }) {
    super({ id: props.id, created_at: props.created_at });
    this.name = props.name;
    this.ingredients = props.ingredients;
    this.instructions = props.instructions;
    this.image_uri = props.image_uri;
    this.video_uri = props.video_uri;
    this.servings = props.servings;
    this.prep_time_min = props.prep_time_min;
    this.user_id = props.user_id;
    this.category_id = props.category_id;
  }

  public updateName(newName: string) {
    if (!newName || newName.trim().length < 3) {
      throw new Error('O nome da receita deve ter pelo menos 3 caracteres.');
    }
    this.name = newName;
  }

  public updateInstructions(newInstructions: InstructionStep[]) {
    this.instructions = newInstructions;
  }
}
