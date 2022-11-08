const config = require('./utils/config')
const express = require('express')
const app = express()
const front_port = 10101

app.get('/hello', (req, res) => {
    res.send(`${config.CONFIG_TEST_MSG}\n`);
});

app.listen(front_port, () => {
    console.log(`DSatter server started, listening to port ${front_port}`);
});
