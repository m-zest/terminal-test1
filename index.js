const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { spawn } = require('node-pty');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {

    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
    const ptyProcess = spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.env.PWD,
        env: process.env
    });

    ptyProcess.on('data', (data) => {
        socket.emit('output', data);
    });

    socket.on('input', (input) => {
        ptyProcess.write(input + '\n'); 
    });
    

    socket.on('disconnect', () => {
        ptyProcess.kill();
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
