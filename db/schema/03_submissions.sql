-- Drop and recreate submissions table (Example)

DROP TABLE IF EXISTS submissions CASCADE;
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER REFERENCES users(id),
  poll_id INTEGER REFERENCES polls(id),
  submission_data TEXT[] NOT NULL
);



