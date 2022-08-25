import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryColumn()
    id: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({unique: true})
    natcode: string;

    @Column({unique: true})
    username: string;

    @Column()
    passcode: string;

    @Column()
    education_level: string;

    @Column()
    job: string;

    @Column()
    phone_number: string;

    @Column()
    address: string;

    @Column()
    created_at: Date;
}
