"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSource = void 0;
const scylladb_1 = require("@lambda-group/scylladb");
const base_1 = require("./repository/base");
class DataSource {
    options;
    cluster;
    session = null;
    constructor(options) {
        this.options = options;
        this.cluster = new scylladb_1.Cluster(this.options);
    }
    async initialize(keyspace) {
        this.session = await this.cluster.connect(keyspace);
        return this;
    }
    getSession() {
        if (!this.session)
            throw new Error('No session available');
        return this.session;
    }
    getRepository(entity) {
        return new base_1.Repository(this, entity);
    }
    [Symbol.dispose]() {
        if (this.session) {
            this.session = null;
        }
    }
}
exports.DataSource = DataSource;
