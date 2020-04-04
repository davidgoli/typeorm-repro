import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany
} from "typeorm";
import { Group } from "./Group";
import { Auth } from "./Auth";
import { GroupMember } from "./GroupMember";

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @ManyToMany(() => Group, group => group.users)
  @JoinTable({
    name: "group_member",
    joinColumn: {
      name: "user",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "group",
      referencedColumnName: "id"
    }
  })
  groups: Group[];

  @OneToMany(() => Auth, auth => auth.user)
  auth_methods: Auth[];

  @OneToMany(() => GroupMember, gm => gm.user)
  group_memberships: GroupMember[];
}
