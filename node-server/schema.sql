CREATE TABLE messages (
    node_id INTEGER NOT NULL,
    id INTEGER NOT NULL,
    messageId INTEGER PRIMARY KEY NOT NULL,
    chat_id INTEGER NOT NULL REFERENCES chats,
    messageText TEXT,
    messageDateTime TEXT,
    messageSender TEXT
);

CREATE TABLE chats (
	node_id INTEGER NOT NULL,
    id INTEGER NOT NULL,
    chatId INTEGER PRIMARY KEY NOT NULL,
    chatName TEXT
);

CREATE TABLE node (
    id INTEGER PRIMARY KEY NOT NULL,
    password TEXT
);