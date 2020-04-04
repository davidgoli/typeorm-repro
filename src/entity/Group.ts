import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  Column,
  OneToMany,
  JoinTable
} from "typeorm";
import { User } from "./User";
import { GroupMember } from "./GroupMember";

@Entity({ name: "group" })
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => User, user => user.groups)
  users: User[];

  @OneToMany(() => GroupMember, gm => gm.group)
  group_memberships: GroupMember[];
}
