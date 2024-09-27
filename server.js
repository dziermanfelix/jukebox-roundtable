import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import mongoose from 'mongoose';
import jukeboxRouter from './routes/jukeboxRouter.js';
import authRouter from './routes/authRouter.js';
import { authenticateToken } from './middleware/authMiddleware.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/auth', authRouter);
app.use('/jukebox', authenticateToken, jukeboxRouter);

// catch controller routing error
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'request made to nonexistent route' });
});

// internal server error
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8144;
try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on PORT ${port}...`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
