creator_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  choices TEXT[][] NOT NULL
  name_required BOOLEAN,


INSERT INTO polls (creator_id, title, choices, name_required)
VALUES (3, 'movies', [['batman', 'a fun movie'], ['zombieland', 'a zombie movie']], true);
 (4, 'games', [['manbat', 'a fun game'], ['landzombie', 'a zombie game']], false);
