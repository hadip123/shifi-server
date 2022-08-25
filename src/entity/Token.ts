import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Token {
    @PrimaryColumn()
    id: string;

    @JoinColumn()
    @ManyToOne(() => User)
    user: User;

    @Column()
    created_at: Date;
}