-- Drop and recreate polls table (Example)

DROP TABLE IF EXISTS polls CASCADE;
CREATE TABLE polls (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  choices TEXT[][] NOT NULL,
  name_required BOOLEAN
);



