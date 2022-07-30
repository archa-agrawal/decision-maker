-- Drop and recreate choices table (Example)

DROP TABLE IF EXISTS choices CASCADE;

CREATE TABLE choices (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE
);
