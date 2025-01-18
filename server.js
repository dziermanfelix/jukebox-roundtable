import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import mongoose from 'mongoose';
import jukeboxRouter from './routes/jukeboxRouter.js';
import queueRouter from './routes/queueRouter.js';
import authRouter from './routes/authRouter.js';
import spotifyRouter from './routes/spotifyRouter.js';
import accessTokenRouter from './routes/accessTokenRouter.js';
import sessionRouter from './routes/sessionRouter.js';
import { authenticateUser } from './middleware/authMiddleware.js';
import { apiVersionBaseUrl, globalServerPort } from './global/api.js';
import { nodeEnv, serverPort, mongoUrl } from './utils/environmentVariables.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
export const serverSocket = new Server(server, {
  cors: {
    origin: '*',
  },
});

serverSocket.on('connection', (socket) => {
  // TODO make client socket a singleton
  console.log(`${serverSocket.engine.clientsCount} clients connected`);
  // socket.on(startJukeboxEvent, ({ jukebox, deviceId }) => {
  //   startJukebox(jukebox, deviceId);
  // });
  socket.on('disconnect', () => {});
});

app.use(express.json());
app.use(cookieParser());
if (nodeEnv === 'development') {
  app.use(morgan('dev'));
}

app.use(`${apiVersionBaseUrl}auth`, authRouter);
app.use(`${apiVersionBaseUrl}session`, sessionRouter);
app.use(`${apiVersionBaseUrl}jukebox`, authenticateUser, jukeboxRouter);
app.use(`${apiVersionBaseUrl}queue`, queueRouter);
app.use(`${apiVersionBaseUrl}spotify`, spotifyRouter);
app.use(`${apiVersionBaseUrl}access-token`, accessTokenRouter);

// catch controller routing error
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'request made to nonexistent route' });
});

// internal server error
app.use(errorHandlerMiddleware);

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
