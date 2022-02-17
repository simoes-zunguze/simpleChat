import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export interface Message {
    username: string;
    date?: string;
    room: string;
    me?: boolean;
    text: string;
    id: string;
    type: string;
}

function getTime() {
    const time = `${new Date().getHours()}:${new Date().getMinutes()}`;
    return time;
}

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../client/build/index.html')));

app.use(express.static(path.join(__dirname, '../client/build')));

io.on('connection', (socket) => {
    // eslint-disable-next-line no-console
    console.log(`User connected with ID: ${socket.id}`);
    let roomDetails:{room: string, username:string};

    socket.on('join_chat_room', (data) => {
        const time = `${new Date().getHours()}:${new Date().getMinutes()}`;
        // eslint-disable-next-line no-console
        console.log(data);
        socket.join(data.room);
        roomDetails = data;
        socket.to(data.room).emit('receive', {
            type: 'join',
            date: time,
            username: data.username,
            id: uuidv4(),
        });
    });

    socket.on('send', (data) => {
        const time = `${new Date().getHours()}:${new Date().getMinutes()}`;

        const message: Message = { ...data, date: time, id: uuidv4() };
        socket.to(data.room).emit('receive', message);
        // eslint-disable-next-line no-console
        console.log(message);
    });

    socket.on('disconnect', () => {
        if (roomDetails?.room) {
            socket.to(roomDetails.room).emit('receive', {
                type: 'disconnect',
                date: getTime(),
                username: roomDetails.username,
                id: socket.id,
            });

            // eslint-disable-next-line no-console
            console.log(`User ID: ${socket.id} Disconnected from ${roomDetails.room}`);
        }
    });
});

httpServer.listen(3001, () => {
    // eslint-disable-next-line no-console
    console.log('Server started...');
});
