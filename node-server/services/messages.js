// publish-subscribe pattern
// topics ? (for nodes, clients)
// https://www.sitepoint.com/implement-task-queue-node-js/
// https://adevait.com/nodejs/introduction-to-queues-nodejs
// https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/

const messQueue = []

const enqueue = (msg) => {
  messQueue.push(mesg)
}

const dequeue = (mesg) => {
  messQueue.shift()
}

module.exports = {
  field: null
}
