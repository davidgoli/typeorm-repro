import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, JoinColumn} from "typeorm";
import { Group } from "./Group"
import { Auth } from "./Auth"

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

    @OneToMany(() => Auth, (auth) => auth.user)
    auth_methods: Auth[]
}
