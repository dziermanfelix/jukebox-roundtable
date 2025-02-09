import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import jukeboxRouter from './routes/jukeboxRouter.js';
import jukeboxPrivateRouter from './routes/jukeboxPrivateRouter.js';
import authRouter from './routes/authRouter.js';
import spotifyRouter from './routes/spotifyRouter.js';
import sessionRouter from './routes/sessionRouter.js';
import { authenticateUser } from './middleware/authMiddleware.js';
import { apiVersionBaseUrl } from './common/api.js';
import { nodeEnv } from './utils/environmentVariables.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const app = express();

if (nodeEnv === 'development') {
  app.use(morgan('dev'));
}
// keep this here for testing in production
if (nodeEnv === 'production') {
  app.use(morgan('dev'));
}
app.use(cookieParser());
app.use(express.json());

app.use(`${apiVersionBaseUrl}/auth`, authRouter);
app.use(`${apiVersionBaseUrl}/session`, sessionRouter);
app.use(`${apiVersionBaseUrl}/jukebox`, jukeboxRouter);
app.use(`${apiVersionBaseUrl}/jukebox-priv`, authenticateUser, jukeboxPrivateRouter);
app.use(`${apiVersionBaseUrl}/spotify`, spotifyRouter);

if (nodeEnv !== 'test') {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  app.use(express.static(path.resolve(__dirname, './client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
  });
}

// catch controller routing error
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'request made to nonexistent route' });
});

// internal server error
app.use(errorHandlerMiddleware);
