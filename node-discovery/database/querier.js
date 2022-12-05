const sqlite3 = require('sqlite3').verbose()
const logger  = require('../../common/utils/logger')
const config = require('../utils/config.js')

let db

/**
 * Opens or creates local sqlite3 database
 */
const initiateDatabase = async () => {
  db = new sqlite3.Database(config.DB_PATH, (err) => {
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
