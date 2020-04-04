import {
  PrimaryGeneratedColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  Unique
} from "typeorm";
import { User } from "./User";
import { Group } from "./Group";

@Entity({ name: "group_member" })
@Unique("unique_group_member", ["user", "group"])
export class GroupMember {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, user => user.group_memberships, { primary: true })
  @JoinColumn({
    name: "user",
    referencedColumnName: "id"
  })
  user: User;

  @ManyToOne(() => Group, group => group.group_memberships, { primary: true })
  @JoinColumn({
    name: "group",
    referencedColumnName: "id"
  })
  group: Group;
}
