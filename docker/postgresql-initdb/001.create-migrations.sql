START TRANSACTION;

CREATE TABLE IF NOT EXISTS migrations (
	id serial PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	file VARCHAR UNIQUE NOT NULL
);

INSERT INTO migrations (file) VALUES ('001.create-migrations.sql');

COMMIT;
