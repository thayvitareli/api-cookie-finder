import { BaseEntity } from "../../../../shared/entity/base-entity";

export class Notification extends BaseEntity {
    public userId: string;
    public title: string;
    public message: string;
    public link: string;
    public readAt: Date;

    constructor(props: {
        id?: string;
        userId: string;
        title: string;
        message: string;
        link: string;
        readAt?: Date;
        created_at?: Date;
    }) {
        super({ id: props.id, created_at: props.created_at });
        this.userId = props.userId;
        this.title = props.title;
        this.message = props.message;
        this.link = props.link;
        this.readAt = props.readAt;
    }

    public markAsRead() {
        this.readAt = new Date();
    }
}