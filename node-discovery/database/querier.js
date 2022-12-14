const sqlite3 = require('sqlite3').verbose()
const logger  = require('../../common/utils/logger')

let db = null

/**
 * Opens or creates local sqlite3 database
 */
const initiateDatabase = async (dbpath) => {
  db = new sqlite3.Database(dbpath, (err) => {
    if (err) logger.error('Error in connecting to the database: ', err)
    else logger.info('Connected to dsatter database')
  })
}

/**
 * Executes database queries
 * @param {string} methodName
 * @param {string} query
 * @param {string[]} params
 * @returns {Promise}
 */
const executeQuery = async (methodName, query, params = []) => {
  if (db === null) {
    logger.error('Attempted to execute a DB query on a nonexisting DB connection')
    return undefined
  }

  // sqlite3 db throws error if attempting to execute queries when connection is closed
  return new Promise((resolve, reject) => {
    db[methodName](query, params, function(err, data) {
      if (err) {
        logger.error('Error running sql: ' + query)
        logger.error(err)
        reject(err)
      } else
        resolve(data)
    })
  })
}

/**
 * Closes connection to local sqlite3 database
 */
const closeDatabaseConnection = () => {
  db.close((err) => {
    if (err) logger.error('Error in closing database connection: ', err)
    else logger.info('Database connection closed')
  })
}


module.exports = {
  initiateDatabase,
  executeQuery,
  closeDatabaseConnection
}
