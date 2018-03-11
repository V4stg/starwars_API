ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS pk_user_id CASCADE;


DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.user_id_seq;
CREATE TABLE users (
    id serial NOT NULL UNIQUE,
    username VARCHAR(32) UNIQUE,
    password varchar
);


ALTER TABLE ONLY users
    ADD CONSTRAINT pk_user_id PRIMARY KEY (id);