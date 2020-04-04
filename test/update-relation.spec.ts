import { createConnection, getRepository, Connection } from "typeorm"
import { User } from "../src/entity/User"
import { Group } from "../src/entity/Group"

let conn: Connection

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
  })
})

afterAll(() => conn.close())

it("allows updating the relation from one side of a many-to-many", async () => {
  const userRepo = getRepository(User)

  const user = await userRepo.save(
    userRepo.create({ firstName: "Test", lastName: "User" })
  )

  const groupRepo = getRepository(Group)
  const [group1, group2, group3] = await groupRepo.save(
    groupRepo.create([
      { name: "Group1" },
      { name: "Group2" },
      { name: "Group3" }
    ])
  )

  user.groups = [group1]
  await userRepo.save(user)

  const readUser = await userRepo.findOne(user.id, { relations: ["groups"] })
  expect(readUser.groups).toEqual([group1])

  readUser.groups = [group2, group3]
  await userRepo.save(readUser)

  const readUser2 = await userRepo.findOne(user.id, { relations: ["groups"] })
  expect(readUser2.groups).toEqual([group2, group3])

  readUser2.groups = []
  await userRepo.save(readUser2)

  const readUser3 = await userRepo.findOne(user.id, { relations: ["groups"] })
  expect(readUser3.groups).toEqual([])
})

it("allows updating the relation from one side of a many-to-many", async () => {
  const userRepo = getRepository(User)

  const user = await userRepo.save(
    userRepo.create({ firstName: "Test", lastName: "User" })
  )

  const groupRepo = getRepository(Group)
  const [group1, group2, group3] = await groupRepo.save(
    groupRepo.create([
      { name: "Group1" },
      { name: "Group2" },
      { name: "Group3" }
    ])
  )

  user.groups = [group1]
  await userRepo.save(user)

  const readUser = await userRepo.findOne(user.id, { relations: ["groups"] })
  expect(readUser.groups).toEqual([group1])

  readUser.groups = [group2, group3]
  await userRepo.save(readUser)

  const readUser2 = await userRepo.findOne(user.id, { relations: ["groups"] })
  expect(readUser2.groups).toEqual([group2, group3])

  readUser2.groups = []
  await userRepo.save(readUser2)

  const readUser3 = await userRepo.findOne(user.id, { relations: ["groups"] })
  expect(readUser3.groups).toEqual([])
})
