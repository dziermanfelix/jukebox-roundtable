import 'express-async-errors';
import mongoose from 'mongoose';
import { globalServerPort } from './common/api.js';
import { serverPort, mongoUrl } from './utils/environmentVariables.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { app } from './app.js';

export const server = createServer(app);
export const serverSocket = new Server(server, {
  cors: {
    origin: '*',
  },
});

serverSocket.on('connection', (socket) => {
  console.log(`${serverSocket.engine.clientsCount} clients connected`);
  socket.on('disconnect', () => {});
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
