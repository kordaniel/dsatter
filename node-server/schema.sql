CREATE TABLE messages (
    node_id INTEGER NOT NULL,
    message_id INTEGER NOT NULL AUTOINCREMENT,
    chat_id INTEGER NOT NULL REFERENCES chats,
    messageText TEXT,
    messageDateTime TEXT,
    messageSender TEXT,
    PRIMARY KEY (node_id, message_id)
);

CREATE TABLE chats (
	node_id INTEGER NOT NULL,
    chat_id INTEGER NOT NULL AUTOINCREMENT,
    chatName TEXT,
    PRIMARY KEY (node_id, chat_id)
);
