import { Uuid } from "@lambda-group/scylladb";
import { BaseEntity, Column, ColumnType, DataSource, Entity, PrimaryGeneratedColumn } from "../../src/index";

@Entity("users")
class User extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: "id",
    type: ColumnType.UUID
  })
  id: Uuid;

  @Column({
    name: "name",
    type: ColumnType.TEXT
  })
  name: string;
}

async function main() {
  using scyllaDataSource = await new DataSource({
    nodes: ["localhost:9042"],
  }).initialize("charydbis");

  const userRepository = scyllaDataSource.getRepository(User);

  const user = new User();
  user.id = Uuid.randomV4();
  user.name = "John Doe";

  await userRepository.save(user);

  const found_user = await userRepository.findOne(user.id);

  console.log(found_user);
} // DataSource will be discarded here on [Symbol.dispose] because of `using`

main();
