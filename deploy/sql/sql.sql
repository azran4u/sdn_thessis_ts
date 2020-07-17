drop table IF EXISTS nodes cascade;
drop table IF EXISTS edges cascade;
drop table IF EXISTS producers cascade;
drop table IF EXISTS subscribers cascade;
drop table IF EXISTS requests cascade;
drop table IF EXISTS VideoRequestsResults cascade;
drop table IF EXISTS VideoRequestsResultsEdges cascade;


DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE LOWER(typname) = LOWER('SUBSCRIBER_PRIORITY')) THEN        
		CREATE TYPE SUBSCRIBER_PRIORITY AS ENUM ('GOLD', 'SILVER', 'BRONZE');
	END IF;

	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE LOWER(typname) = LOWER('LAYER')) THEN        
		CREATE TYPE LAYER AS ENUM ('BASE', 'EL1', 'EL2');
	END IF;
	
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE LOWER(typname) = LOWER('ALGORITHM')) THEN        
		CREATE TYPE ALGORITHM AS ENUM ('LBS', 'LLVS');
	END IF;

	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE LOWER(typname) = LOWER('VIDEO_REQUEST_STATUS')) THEN        
		CREATE TYPE VIDEO_REQUEST_STATUS AS ENUM ('PENDING', 'INVALID', 'SERVED');
	END IF;

END
$$;

CREATE TABLE if not exists nodes (
  _id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY
);

CREATE TABLE if not exists edges (
  _id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  from_node INTEGER REFERENCES nodes(_id) NOT NULL,
  to_node INTEGER REFERENCES nodes(_id) NOT NULL,
  bw INTEGER NOT NULL DEFAULT 0,
  latency INTEGER NOT NULL DEFAULT 0,
  jitter INTEGER NOT NULL DEFAULT 0
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

CREATE TABLE if not exists VideoRequestsResults (
  _id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  alogorithm ALGORITHM NOT NULL,
  videoRequest INTEGER REFERENCES requests(_id) NOT NULL,
  status VIDEO_REQUEST_STATUS NOT NULL DEFAULT 'PENDING',
  e2e_latency INTEGER NOT NULL DEFAULT 2147483647,
  e2e_jitter INTEGER NOT NULL DEFAULT 2147483647, 
  e2e_hopCount INTEGER NOT NULL DEFAULT 2147483647,
  unique (alogorithm, videoRequest)
);

CREATE TABLE if not exists VideoRequestsResultsEdges (  
  _id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  videoRequestResult INTEGER REFERENCES VideoRequestsResults(_id) NOT NULL,
  edge INTEGER REFERENCES edges(_id) NOT NULL
);
