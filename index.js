const express = require('express');
const server = express();
server.use(express.json());
const postRouter = require('./apiRouter/postRouter.js');

server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
    res.send('Welcome to posts api')
});

const port = 5000
server.listen(port, () => {
    console.log(`\n server is running on localhost:${port}!`)
});