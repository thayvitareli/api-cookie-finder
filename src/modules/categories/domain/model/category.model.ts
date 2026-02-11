import { BaseEntity } from 'src/shared/entity/base-entity';

export class Category extends BaseEntity {
  public name: string;
  public image_uri: string;
  public code: string;

  constructor(props: {
    id?: string;
    name: string;
    image_uri: string;
    code: string;
    views?: number;
    created_at?: Date;
  }) {
    super({ id: props.id, created_at: props.created_at });
    this.name = props.name;
    this.image_uri = props.image_uri;
    this.code = props.code;
    this.views = props.views || 0;
  }

  public views: number;

  public rename(newName: string) {
    if (!newName.trim())
      throw new Error('Nome da categoria não pode ser vazio.');
    this.name = newName;
  }
}
