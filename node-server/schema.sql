CREATE TABLE messages (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER REFERENCES chats,
    messageText TEXT,
    messageDateTime TEXT,
    messageSender TEXT
);

CREATE TABLE chats (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
    chatName TEXT
);
