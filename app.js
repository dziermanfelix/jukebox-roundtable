import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import jukeboxRouter from './routes/jukeboxRouter.js';
import jukeboxPrivateRouter from './routes/jukeboxPrivateRouter.js';
import queueRouter from './routes/queueRouter.js';
import authRouter from './routes/authRouter.js';
import spotifyRouter from './routes/spotifyRouter.js';
import sessionRouter from './routes/sessionRouter.js';
import { authenticateUser } from './middleware/authMiddleware.js';
import { apiVersionBaseUrl } from './common/api.js';
import { nodeEnv } from './utils/environmentVariables.js';

export const app = express();

app.use(express.json());
app.use(cookieParser());
if (nodeEnv === 'development') {
  app.use(morgan('dev'));
}

app.use(`${apiVersionBaseUrl}/auth`, authRouter);
app.use(`${apiVersionBaseUrl}/session`, sessionRouter);
app.use(`${apiVersionBaseUrl}/jukebox`, jukeboxRouter);
app.use(`${apiVersionBaseUrl}/jukebox-priv`, authenticateUser, jukeboxPrivateRouter);
app.use(`${apiVersionBaseUrl}/queue`, queueRouter);
app.use(`${apiVersionBaseUrl}/spotify`, spotifyRouter);

// catch controller routing error
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'request made to nonexistent route' });
});

// internal server error
app.use(errorHandlerMiddleware);
