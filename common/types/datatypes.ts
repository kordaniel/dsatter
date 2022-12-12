/**
 * Message in database
 */
type Message = {
  nodeId: number, // given by discovery node
  id: number, // given by the node, manual autoincrement
  messageId: number, // nodeId + id
  text: string,
  datetime: string,
  sender: string,
  chatId: number // nodeId + id of the chat
}

/**
 * Chat in database
 */
type Chat = {
  nodeId: number, // given by discovery node
  id: number, // given by the node, manual autoincrement
  chatId: number, // nodeId + id
  name: string
}

/**
 * Data between servers
 */
type SyncMessage = {
  name: string,
  payload: any
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
