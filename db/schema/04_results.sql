-- Drop and recreate results table

DROP TABLE IF EXISTS results CASCADE;
CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER REFERENCES submissions(id) ON DELETE CASCADE,
  choice_id INTEGER REFERENCES choices(id) ON DELETE CASCADE,
  choice_order INTEGER
);
