create table if not exists movie(
  id serial primary key,
  title varchar(255),
  release_date varchar(255),
  overview varchar(100000),
  poster_path varchar(255),
  comment varchar(255)
);


