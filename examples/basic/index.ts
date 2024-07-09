import { Uuid } from "@lambda-group/scylladb";
import {
	BaseEntity,
	Column,
	DataSource,
	Entity,
	PrimaryKeyProp,
} from "../../src/index";

@Entity("users")
class User extends BaseEntity {
	@Column({ partitionKey: true })
	id: Uuid;

	@Column({ clusteringKey: true })
	name: string;

	@Column()
	address: string;

	[PrimaryKeyProp]?: [["id"], ["name"]];
}

async function main() {
	using scyllaDataSource = await new DataSource({
		nodes: ["localhost:9042"],
	}).initialize("examples_basic");

	const userRepository = scyllaDataSource.getRepository(User);

	const user = new User();
	user.id = Uuid.randomV4();
	user.name = "John Doe";
	user.address = "123 Main St.";

	await userRepository.save(user);

	const result = await userRepository.findBy({
		address: user.address,
		allowFiltering: true,
	});

	console.log(result[0]);
} // DataSource will be discarded here on [Symbol.dispose] because of `using`

main();
