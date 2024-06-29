-- vim: set ft=sql:

CREATE KEYSPACE charydbis WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };

CREATE TABLE charydbis.users (
  id uuid,
  name text,
  PRIMARY KEY (id)
);
