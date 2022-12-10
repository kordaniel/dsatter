CREATE TABLE nodes (
    id INTEGER PRIMARY KEY NOT NULL,
    password TEXT
);

CREATE TABLE chats (
	id INTEGER PRIMARY KEY NOT NULL,
    syncport INTEGER NOT NULL,
    clientport INTEGER NOT NULL,
    address TEXT NOT NULL)
);
