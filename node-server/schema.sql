CREATE TABLE ownMessages (
    node_id INTEGER NOT NULL,
    id INTEGER PRIMARY KEY,
    chat_id INTEGER,
    messageText TEXT NOT NULL,
    messageDateTime TEXT NOT NULL,
    messageSender TEXT NOT NULL
);

CREATE TABLE outsideMessages (
    node_id INTEGER NOT NULL,
    id INTEGER NOT NULL,
    chat_id INTEGER,
    messageText TEXT NOT NULL,
    messageDateTime TEXT NOT NULL,
    messageSender TEXT NOT NULL,
    PRIMARY KEY (node_id, id))
);

CREATE TABLE ownChats (
	node_id INTEGER NOT NULL,
    id INTEGER PRIMARY KEY,
    chatName TEXT NOT NULL
);

CREATE TABLE outsideChats (
	node_id INTEGER NOT NULL,
    id INTEGER NOT NULL,
    chatName TEXT NOT NULL,
    PRIMARY KEY (node_id, id))
);


CREATE TABLE node (
    id INTEGER PRIMARY KEY NOT NULL,
    password TEXT
);