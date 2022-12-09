/**
 * Message in database
 */
type Message = {
  nodeId: number, // given by discovery node
  id: number, // given by the node, manual autoincrement
  messageId: string, // nodeId + id
  text: string,
  datetime: string,
  sender: string,
  chatId: string // nodeId + id of the chat
}

/**
 * Chat in database
 */
type Chat = {
  nodeId: number, // given by discovery node
  id: number, // given by the node, manual autoincrement
  chatId: string, // nodeId + id
  name: string
}

/**
 * Message from client to server
 */
type ClientMessage = {
  type: string,
  messagetext: string,
  sender: string,
  chatId: number
}

/**
 * Data between servers
 */
type SyncMessage = {
  type: string,
  messages: Message[],
  chats: Chat[],
  timestamp: string
}

/**
 * Registered nodes in discovery database
 */
type RegisteredNode = {
  id: number, // nodeId
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
