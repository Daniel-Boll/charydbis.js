<div align="center">
  <a href="https://github.com/daniel-boll/charydbis">
    <img src="assets/logo.png" alt="scylladb" width="340" />
  </a>

  <h4>🚀 JavaScript ORM for ScyllaDB. Pre-release stage. 🧪🔧</h4>
</div>

## 📥 Installing 📥

To install this package, use the following command:

```bash
npm i @lambda-group/charydbis @lambda-group/scylladb
```

## 🚀 Getting Started 🚀

These instructions will get you a copy of the project up and running 🏃 on your local machine for development and testing purposes.

### 📋 Prerequisites 📋

- Docker: We use Docker 🐳 to run the Scylla database easily without the need for a complex local setup.
- Node.js: Make sure you have Node.js installed on your system to run JavaScript code.
- Scylla Driver: To handle the connections.

### 🌟 Quickstart 🌟

1. **Start ScyllaDB in Docker:**

   Run a ScyllaDB instance using the following Docker command:

   ```bash
   docker run --name scylladb -d --rm -it -p 9042:9042 scylladb/scylla --smp 2
   ```

   This command pulls the Scylla image if it's not already present on your system, and starts a new 🌟 container with the Scylla database.

2. **Create a DataSource:**

   Here's a simple script that creates a data source:

    ```typescript
    import { DataSource } from "@lambda-group/charydbis";
    
    using scyllaDataSource = await new DataSource({
     nodes: ["localhost:9042"],
    }).initialize("system_schema");
    ```

   Here we leverage the `using` keyword so in the end of the scope on [Symbol.dispose] we automatically close the connection so you don't have to bother.

4. **Using a Username and Password:**

    If your data source uses authentication (username and or password) you can add the following to your DataSource constructor:

    ```typescript
      auth: {
        username: "<username>",
        password: "<password>"
      }
    ```

5. **Create an entity:**

    Now we can create a structure that will represent out data.
      
    ```typescript
    @Entity("scylla_tables")
    class ScyllaTables {
      @Column({ name: "name", type: ColumnType.TEXT })
      name: string;
    }
    ```

6. **Access the repository:**

    You can now get a default repository from the entity.
    
    ```ts
    const scyllaTablesRepository = scyllaDataSource.getRepository(ScyllaTables);
    
    const tables: Array<ScyllaTables> = await scyllaTablesRepository.find();
    ```

---

You can find more [examples](https://github.com/daniel-boll/charydbis/tree/main/examples) in the examples folder.
