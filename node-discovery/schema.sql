CREATE TABLE nodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    password TEXT NOT NULL
);

CREATE TABLE activeNodes (
	id INTEGER PRIMARY KEY NOT NULL,
    syncport INTEGER NOT NULL,
    clientport INTEGER NOT NULL,
    address TEXT NOT NULL)
);
