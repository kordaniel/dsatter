/**
 * Makes querys to dsatter database
 */
class Dao {

    /**
     * Constructor
     * @param {*} database 
     */
    constructor(database) {
        this.db = database
    }

    /**
     * Executes database queries
     * @param {string} methodName 
     * @param {string} query 
     * @param {string[]} params 
     * @returns {Promise}
     */
    executeQuery = async (methodName, query, params = []) => {
        return new Promise((resolve, reject) => {
            this.db[methodName](query, params, function(err, data) {
                console.log(data)
                if (err) {
                    console.log('Error running sql: ' + query)
                    console.log(err)
                    reject(err)
                } else
                    resolve(data)
                })
        })
    }

    /**
     * Creates table Messages if that does not exist.
     * @returns {Promise}
     */
     createTableMessages() {
        return this.executeQuery('run', `CREATE TABLE IF NOT EXISTS messages (
            id INTEGER AUTOINCREMENT PRIMARY KEY,
            chat_id INTEGER REFERENCES chats,
            messageText TEXT,
            messageDateTime TEXT,
            messageSender TEXT)`)
    }

    /**
     * Creates table Messages if that does not exist.
     * @returns {Promise}
     */
     createTableChats() {
        return this.executeQuery('run', `CREATE TABLE IF NOT EXISTS chats (
            id INTEGER AUTOINCREMENT PRIMARY KEY,
            chatName TEXT)`)
    }

    /**
     * Returns chat with given chatID
     * @param {number} chatId
     * @returns {Promise}
     */
    getChat(chatId) {
        return this.executeQuery('get', `SELECT chatName AS 'name'
            FROM chats WHERE chat_id = :chatId`, [chatId])
    } 

    /**
     * Returns messages with given chatID
     * @param {number} chatId
     * @returns {Promise}
     */
    getMessages(chatId) {
        return this.executeQuery('get', `SELECT messageText AS 'text',
            messageDateTime AS 'time',
            messageSender AS 'sender'
            FROM messages WHERE chat_id = :chatId`, [chatId])
    }

    /**
     * Adds new chat to table chats
     * @param {string} chatName 
     * @returns {Promise}
     */
    addNewChat(chatName) {
        return this.executeQuery('run', `INSERT INTO chats
            (chatName) VALUES (?)`, [chatName])
    }

    /**
     * Adds new message to table messages
     * @param {text: string, time: string, sender: string, chat_id: integer} message 
     * @returns {Promise}
     */
    addNewMessage(message) {
        const {text, time, sender, chat_id} = message
        return this.executeQuery('run', `INSERT INTO messages
            (messageText, messageDateTime, messageSender, chat_id) 
            VALUES (?, ?, ?, ?)`, [text, time, sender, chat_id])
    }

}

module.exports = Dao