// add and use dotenv

const DEV_ENV = process.env.NODE_ENV === 'development'

const CONFIG_TEST_MSG = DEV_ENV
  ? 'Hello developers (running in dev environment)'
  : 'Hello world (running in production environment)'

module.exports = {
  DEV_ENV,
  CONFIG_TEST_MSG
}
