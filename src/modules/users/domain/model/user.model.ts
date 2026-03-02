import { BaseEntity } from '../../../../shared/entity/base-entity';

export class User extends BaseEntity {
  public name: string;
  public email: string;
  public password: string;
  public avatar?: string;
  public saved_posts?: any[];

  constructor(props: {
    id?: string;
    name: string;
    email: string;
    password: string;
    avatar?: string;
    saved_posts?: any[];
    created_at?: Date;
  }) {
    super({ id: props.id, created_at: props.created_at });
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.avatar = props.avatar;
    this.saved_posts = props.saved_posts;
  }

  public changePassword(newPassword: string) {
    if (newPassword.length < 6) {
      throw new Error("A senha deve ter pelo menos 6 caracteres.");
    }
    this.password = newPassword;
  }

  public updateAvatar(newAvatarUrl: string) {
    this.avatar = newAvatarUrl;
  }
}
