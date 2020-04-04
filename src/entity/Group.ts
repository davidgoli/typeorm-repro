import {Entity, PrimaryGeneratedColumn, ManyToMany, Column} from "typeorm";
import { User } from "./User"

@Entity({ name: 'group' })
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => User, (user) => user.groups)
    users: User[]
}
