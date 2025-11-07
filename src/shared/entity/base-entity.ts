export abstract class BaseEntity {
  public readonly id: string;
  public readonly created_at?: Date;

  protected constructor(props: { id?: string; created_at?: Date }) {
    this.id = props.id ?? crypto.randomUUID();
    this.created_at = props.created_at ?? new Date();
  }
}
