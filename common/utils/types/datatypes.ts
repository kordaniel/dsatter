/**
 * Message in database
 */
type Message = {
    nodeId: number, // given by discovery node
    id: number, // given by the node, manual autoincrement
    text: string,
    time: string,
    sender: string,
    chatId: string //node_id + id of the chat
}

/**
 * Chat in database
 */
type Chat = {
    nodeId: number, // given by discovery node
    id: number, // given by the node, manual autoincrement
    chatId: string, //node_id + id
    chatname: string
}

/**
 * Message from client to server
 */
type ClientMessage = {
    messagetext: string,
    sender: string,
    chatId: number
}

/**
 * Data between servers
 */
type SyncMessage = {
    messages: Message[],
    chats: Chat[],
    timestamp: string
}

/**
 * Registered nodes in discovery database
 */
type RegisteredNode = {
    id: number, // node_id
    password: any
}

/**
 * Active nodes in discovery database
 */
type ActiveNode = {
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
