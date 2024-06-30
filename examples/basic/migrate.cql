-- vim: set ft=sql:

CREATE KEYSPACE examples_basic WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };

CREATE TABLE examples_basic.users (
  id uuid,
  name text,
  PRIMARY KEY (id)
);
