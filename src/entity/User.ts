import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";
import { Group } from "./Group"

@Entity({ name: 'user' })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @ManyToMany(() => Group, (group) => group.users)
    @JoinTable({
        name: 'group_member'
    })
    groups: Group[]
}
