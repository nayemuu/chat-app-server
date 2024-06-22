const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const morgan = require('morgan');
const connectToDatabase = require('./connectToDatabase');
const authRoutes = require('./routes/authRoutes');
const inboxRouter = require('./routes/inboxRouter');

require('dotenv').config();

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/inbox', inboxRouter);

// Create an HTTP server using the Express app
const server = http.createServer(app);

// map data structure, conversationId-> wsClient

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log('Received message:', message.toString());
        // Broadcast message to all clients
        wss.clients.forEach((client, index) => {
            console.log('This is a client', index);
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.send('Welcome to the WebSocket server!');
});

app.get('/', (req, res) => {
    console.log(req);
    res.send('Welcome to root Server');
});

function errorHandler(err, req, res, next) {
    console.log('error = ', err);
    if (res.headersSent) {
        next('error - headers already sent');
    } else if (err?.message) {
        res.status(500).send({ message: err.message });
    } else {
        res.status(500).send({
            message: 'there was an error, express did not give any message for this error',
        });
    }
}

app.use(errorHandler);

server.listen(port, async () => {
    await connectToDatabase();
    console.log(`response address is = http://localhost:${port}`);
});

// To test from browser
// --------------------
// const ws = new WebSocket('ws://localhost:9000');

// ws.onopen = () => {
//   console.log('Connected to WebSocket server');
//   ws.send(JSON.stringify({ username: 'User1', message: 'Hello, World!' }));
// };

// ws.onmessage = (event) => {
//   console.log('Received message from server:', event.data);
// };

// ws.onclose = () => {
//   console.log('Disconnected from WebSocket server');
// };
