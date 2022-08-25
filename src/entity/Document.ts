import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";

@Entity()
export default class Document {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    file_name: string;

    @Column()
    description: string;

    @Column()
    document_number: string;

    @Column({type: 'varchar'})
    access: string;

    @ManyToOne(() => User)
    @JoinColumn()
    author: User;

    @Column()
    created_at: Date;
}