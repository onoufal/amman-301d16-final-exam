DROP TABLE IF EXISTS qoutes;

CREATE TABLE IF NOT EXISTS
qoutes(
  id SERIAL PRIMARY KEY,
  quote VARCHAR,
  character VARCHAR,
  image VARCHAR,
  characterDirection VARCHAR
);

