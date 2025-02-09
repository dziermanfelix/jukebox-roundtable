import 'express-async-errors';
import mongoose from 'mongoose';
import { globalServerPort } from './common/api.js';
import { serverPort, mongoUrl } from './utils/environmentVariables.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { app } from './app.js';
import { parse } from 'url';

export const server = createServer(app);
export const serverSocket = new Server(server, {
  cors: {
    origin: '*',
  },
});

function getRelevantDataFromSocketHandshake(handshake) {
  const parsedUrl = parse(handshake.url, true);
  return { jukeboxName: parsedUrl.query.jukeboxName, sessionId: parsedUrl.query.sessionId };
}

export let connectedUsers = {};
serverSocket.on('connection', (socket) => {
  const relevant = getRelevantDataFromSocketHandshake(socket.handshake);
  console.log(`user connected: ${socket.id}`);
  console.log(`socket id = ${socket.id}`);
  console.log(`relevant ${JSON.stringify(relevant)}`);
  console.log(`${serverSocket.engine.clientsCount} clients connected`);
  connectedUsers[relevant.sessionId] = socket.id;
  console.log(`connectedUsers = ${JSON.stringify(connectedUsers)}`);
  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
    delete connectedUsers[socket.id];
  });
});

export async function startServer() {
  const port = serverPort || globalServerPort;
  try {
    await mongoose.connect(mongoUrl);
    server.listen(port, () => {
      console.log(`server running on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
