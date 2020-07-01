import express from 'express';
import { config } from 'dotenv';
import logger from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import path from 'path';
import errorHandler from './middleware/errorHandler';

config();

const app = express();

if (['development', 'production'].includes(process.env.NODE_ENV)) {
  app.use(logger('dev'));
}

const staticPath = path.join(__dirname, '../public');
app.use(express.static(staticPath));

// Rate Limiter
const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message:
    'We have noticed an unusual amount of request from this IP, please try again later',
});

app.use('/api', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.get('/', (_, res) => {
  res.render('index');
});

app.use(errorHandler);

app.all('*', (_, res) => {
  res.status(404).json({
    status: 'error',
    error: 'resource not found on this server',
  });
});

export default app;
