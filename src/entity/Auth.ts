import {Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column} from "typeorm";
import { User } from "./User"

@Entity()
export class Auth {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => User, (user) => user.auth_methods)
    @JoinColumn({ name: 'user', referencedColumnName: 'id' })
    user: User
}
