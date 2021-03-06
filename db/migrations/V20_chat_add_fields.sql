CREATE TABLE messages 
(
	sender integer NOT NULL,
	receiver integer NOT NULL,
 	sent timestamp with time zone DEFAULT now(),
	status integer DEFAULT 0 --0=new, 1=received, 2=seen
);


GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO production_db;