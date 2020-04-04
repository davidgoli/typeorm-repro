import fc from "fast-check";
import * as _ from "lodash";
import { Group } from "../src/entity/Group";
import { User } from "../src/entity/User";
import { DeepPartial, ObjectType, Connection, createConnection } from "typeorm";

let conn: Connection;

const numRuns: number = 3;

const insertEntityBuilder = (conn: Connection) => <T>(
  entityClass: ObjectType<T>,
  spec: DeepPartial<T>
): Promise<T> =>
  conn
    .getRepository(entityClass)
    .save(conn.getRepository(entityClass).create(spec));

let insertEntity: ReturnType<typeof insertEntityBuilder>;

const createGroup = async (name: string) => {
  const existing = await conn.getRepository(Group).findOne({ where: { name } });
  if (existing) {
    return existing;
  }
  return insertEntity(Group, {
    name
  });
};

const createUser = async (
  firstName: string,
  lastName: string,
  groups: Group[] = []
) => {
  const existing = await conn
    .getRepository(User)
    .findOne({ where: { firstName, lastName } });
  if (existing) {
    return existing;
  }
  return insertEntity(User, {
    firstName,
    lastName,
    groups
  });
};

const getGroupNames = async (userId: number, conn: Connection) => {
  const newGroups = (await conn
    .getRepository(User)
    .findOne(userId, { relations: ["groups"] })).groups;
  return newGroups.map(({ name }) => name);
};

beforeAll(async () => {
  conn = await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: false,
    dropSchema: true,
    entities: ["src/entity/**/*.ts"]
  });

  insertEntity = insertEntityBuilder(conn);
});

afterAll(() => conn.close());

describe("setGroupsForUser", () => {
  it("Can set groups for a user", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string(),
        fc.string(),
        fc.set(fc.string()),
        async (firstName, lastName, groupNames) => {
          const groups = await Promise.all(groupNames.map(createGroup));
          const user = await createUser(firstName, lastName);

          user.groups = groups;
          await conn.getRepository(User).save(user);

          const found = await getGroupNames(user.id, conn);
          expect(_.sortBy(found)).toStrictEqual(_.sortBy(groupNames));
        }
      ),
      { numRuns }
    );
  });

  it("Can update a user's groups", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string(),
        fc.string(),
        fc.set(fc.string()),
        fc.set(fc.string()),
        async (firstName, lastName, beforeGroupNames, afterGroupNames) => {
          if (
            _.isEmpty(firstName) &&
            _.isEmpty(lastName) &&
            _.some(beforeGroupNames, _.isEmpty) &&
            _.some(afterGroupNames, _.isEmpty)
          ) {
            return;
          }

          const beforeGroups = await Promise.all(
            beforeGroupNames.map(createGroup)
          );
          const afterGroups = await Promise.all<Group>(
            _.difference(afterGroupNames, beforeGroupNames).map(createGroup)
          );

          const user = await createUser(firstName, lastName, beforeGroups);

          user.groups = afterGroups;
          await conn.getRepository(User).save(user);

          const found = await getGroupNames(user.id, conn);
          expect(_.sortBy(found)).toStrictEqual(_.sortBy(afterGroupNames));
        }
      ),
      { numRuns }
    );
  });

  it("Can update a user with the same groups", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string(),
        fc.string(),
        fc.set(fc.string()),
        async (firstName, lastName, groupNames) => {
          const groups = await Promise.all(groupNames.map(createGroup));
          const user = await createUser(firstName, lastName, groups);

          user.groups = groups;
          const after = await conn.getRepository(User).save(user);

          expect(after).toMatchObject(user);
        }
      ),
      { numRuns }
    );
  });
});
