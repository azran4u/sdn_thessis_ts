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
  node_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  node_name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE if not exists edges (
  edge_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  edge_from INTEGER REFERENCES nodes(node_id) NOT NULL,
  edge_to INTEGER REFERENCES nodes(node_id) NOT NULL,
  edge_bw INTEGER NOT NULL DEFAULT 0,
  edge_latency INTEGER NOT NULL DEFAULT 0,
  edge_jitter INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE if not exists producers (
  producer_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  node INTEGER REFERENCES nodes(node_id) NOT NULL,
  base_layer_bw FLOAT8 NOT NULL DEFAULT '+infinity',
  enhancement_layer_1_bw FLOAT8 NOT NULL DEFAULT '+infinity',
  enhancement_layer_2_bw FLOAT8 NOT NULL DEFAULT '+infinity'
);

CREATE TABLE if not exists subscribers (
  subscriber_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  node INTEGER REFERENCES nodes(node_id) NOT NULL,
  priority SUBSCRIBER_PRIORITY NOT NULL DEFAULT 'BRONZE'
);



CREATE TABLE if not exists requests (
  request_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  request_subscriber INTEGER REFERENCES subscribers(subscriber_id) NOT NULL,
  request_producer INTEGER REFERENCES producers(producer_id) NOT NULL,
  request_layer LAYER NOT NULL DEFAULT 'BASE'
);

CREATE TABLE if not exists requests_edges (  
  request_id INTEGER REFERENCES requests(request_id) NOT NULL,
  edge_id INTEGER REFERENCES edges(edge_id) NOT NULL,
  PRIMARY KEY(request_id, edge_id)
);

