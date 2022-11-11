const sqlite3 = require('sqlite3').verbose()

/**
 * Opens connection to local sqlite3 database
 */
let db = new sqlite3.Database('./db/dsatter.db', (err) => {
  if (err) console.log('Error in connecting to the database: ', err)
  else console.log('Connected to dsatter database')
})

/**
 * Closes connection to local sqlite3 database
 */
db.close((err) => {
  if (err) console.log('Error in closing database connection: ', err)
  else console.log('Database connection closed')
})