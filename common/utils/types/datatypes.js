/**
 * Message in database
 */
message = {
    node_id: number, // given by discovery node
    id: number, // given by the node, manual autoincrement
    text: string,
    time: string,
    sender: string,
    chat_id: string //node_id + id of the chat
}

/**
 * Chat in database
 */
chat = {
    node_id: number, // given by discovery node
    id: number, // given by the node, manual autoincrement
    chat_id: string, //node_id + id
    chat_name: string
}

/**
 * Message from client to server
 */
client_message = {
    message_text: string,
    sender: string,
    chat_id: number
}

/**
 * Data between servers
 */
sync = {
    messages: message[],
    chats: chat[],
    timestamp: string
}

/**
 * Registered nodes in discovery database
 */
registered_node = {
    id: number, // node_id
    password: any
}

/**
 * Active nodes in discovery database
 */
node = {
    id: number,
    syncport: number,
    clientport: number,
    address: string
}

// ENDPOINTS:
// /api/nodes/register POST {} => {id: number | token}
// /api/nodes/login POST {id: number, password, clientport, syncport} => {successful: boolean, active: node[]}
// /api/nodes/logout POST {id: number, password} => {successful: boolean}
// /api/clients GET => {active: node[]}
