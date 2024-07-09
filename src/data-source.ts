import type {
  ClusterConfig,
  ConnectionOptions,
  ScyllaSession,
} from "@lambda-group/scylladb";
import { Cluster } from "@lambda-group/scylladb";
import type { BaseModel } from "./model/base";
import { Repository } from "./repository/base";

export class DataSource {
  private cluster: Cluster;
  private session: ScyllaSession | null = null;

  constructor(private options: ClusterConfig) {
    this.cluster = new Cluster(this.options);
  }

  async initialize(
    keyspaceOrOptions?: string | ConnectionOptions,
  ): Promise<DataSource> {
    this.session = await this.cluster.connect(keyspaceOrOptions);

    return this;
  }

  getSession(): ScyllaSession | never {
    if (!this.session) throw new Error("No session available");

    return this.session;
  }

  getRepository<T extends BaseModel>(
    model: new () => T extends BaseModel ? T : never,
  ): Repository<T> {
    return new Repository<T>(this, model);
  }

  [Symbol.dispose]() {
    // NOTE: perhaps we should implement a proper cleanup here, session.close();
    if (this.session) {
      this.session = null;
    }
  }
}
