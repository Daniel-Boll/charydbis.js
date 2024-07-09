<h1 align="center">Find By</h1>

ScyllaDB enforces specific constraints on [primary keys](https://university.scylladb.com/courses/data-modeling/lessons/basic-data-modeling-2/topic/primary-key-partition-key-clustering-key/) to ensure optimal performance. These constraints are crucial to consider when working with ORMs. The rules for primary keys are as follows:

- A primary key can consist of a partition key, which may be composed of one or more attributes from the model.
- The primary key can also include a clustering key, which can also be composed of one or more attributes from the model.

This leads to several possible scenarios:

### Single Partition Key

```sql
CREATE TABLE users (
  id uuid,
  PRIMARY KEY (id)
);
```

### Partition Key and Clustering Key

```sql
CREATE TABLE users (
  id uuid,
  name text,
  PRIMARY KEY (id, name)
);
```

### Partition Key Based on Two Fields and a Clustering Key

```sql
CREATE TABLE users (
  id uuid,
  name text,
  address text,
  PRIMARY KEY ((id, name), address)
);
```

### Partition Key Based on N Fields and N Clustering Keys

```sql
CREATE TABLE users (
  id uuid,
  ...
  PRIMARY KEY ((id, ...), ..., ..., ...)
);
```

### Single Partition Key with Multiple Clustering Keys

```sql
CREATE TABLE users (
  id uuid,
  ...
  PRIMARY KEY (id, ..., ..., ...)
);
```

## Implementing Primary Key Rules in the Type System

To enforce these rules within the type system, we developed a type that helps us adhere to these constraints. You can learn more about it in this [blog post](https://daniel-boll.me/posts/charydbisjs/primary-key-inference/).

### Example Model

```ts
@Model("users")
class User extends BaseModel {
  @Column({ partitionKey: true })
  id: Uuid;

  @Column({ clusteringKey: true })
  name: string;

  @Column({ clusteringKey: true })
  address: string;

  [PrimaryKeyProp]?: [["id"], ["name", "address"]];
}
```

The type of the `findBy` query would be as follows:

```ts
type FilterQuery<User> =
  | StrictPick<User, "id">
  | StrictPick<User, "id" | "name">
  | ({
      allowFiltering: true;
    } & Partial<User>);
```

This type definition ensures that queries adhere to ScyllaDB's rules. You can search by the primary key, primary key and clustering key, or any field if you explicitly specify `allowFiltering`. This way, the client is always aware when performing a full scan.

### Enhanced Example with Additional Clustering Key

If we add a new clustering key, the order must follow ScyllaDB's rules:

```ts
@Entity("users")
class User extends BaseEntity {
  @Column({ partitionKey: true })
  id: Uuid;

  @Column({ clusteringKey: true })
  name: string;

  @Column({ clusteringKey: true })
  address: string;

  [PrimaryKeyProp]?: [["id"], ["name", "address"]];
}
```

The `findBy` query type would now be:

```ts
type FilterQuery<User> =
  | StrictPick<User, "id">
  | StrictPick<User, "id" | "name">
  | StrictPick<User, "id" | "name" | "address">
  | ({
      allowFiltering: true;
    } & Partial<User>);
```

To search by `address` only, you would need to provide the following:

```ts
await userRepository.findBy({
  address: "some address",
  allowFiltering: true,
});
```
