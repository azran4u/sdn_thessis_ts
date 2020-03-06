drop table IF EXISTS nodes cascade;
drop table IF EXISTS edges cascade;
drop table IF EXISTS producers cascade;
drop table IF EXISTS subscribers cascade;
drop table IF EXISTS requests cascade;
drop table IF EXISTS requests_edges cascade;

DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE LOWER(typname) = LOWER('SUBSCRIBER_PRIORITY')) THEN        
		CREATE TYPE SUBSCRIBER_PRIORITY AS ENUM ('GOLD', 'SILVER', 'BRONZE');
	END IF;

	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE LOWER(typname) = LOWER('LAYER')) THEN        
		CREATE TYPE LAYER AS ENUM ('BASE', 'EL1', 'EL2');
	END IF;

END
$$;

CREATE TABLE if not exists nodes (
  _id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  text VARCHAR NOT NULL UNIQUE
);

CREATE TABLE if not exists edges (
  _id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  from_node INTEGER REFERENCES nodes(_id) NOT NULL,
  to_node INTEGER REFERENCES nodes(_id) NOT NULL,
  bw INTEGER NOT NULL DEFAULT 0,
  latency INTEGER NOT NULL DEFAULT 0,
  jitter INTEGER NOT NULL DEFAULT 0,
  unique (from_node, to_node)
);

CREATE TABLE if not exists producers (
  _id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  node INTEGER REFERENCES nodes(_id) NOT NULL,
  base_layer_bw FLOAT8 NOT NULL DEFAULT '+infinity',
  enhancement_layer_1_bw FLOAT8 NOT NULL DEFAULT '+infinity',
  enhancement_layer_2_bw FLOAT8 NOT NULL DEFAULT '+infinity'
);

CREATE TABLE if not exists subscribers (
  _id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  node INTEGER REFERENCES nodes(_id) NOT NULL,
  priority SUBSCRIBER_PRIORITY NOT NULL DEFAULT 'BRONZE'
);



CREATE TABLE if not exists requests (
  _id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subscriber INTEGER REFERENCES subscribers(_id) NOT NULL,
  producer INTEGER REFERENCES producers(_id) NOT NULL,
  layer LAYER NOT NULL DEFAULT 'BASE'
);

CREATE TABLE if not exists requests_edges (    
  request_id INTEGER REFERENCES requests(_id) NOT NULL,
  edge_id INTEGER REFERENCES edges(_id) NOT NULL,
  PRIMARY KEY(request_id, edge_id)
);

