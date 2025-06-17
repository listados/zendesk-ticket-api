import express from 'express';
import { connectMongo, mongoConnection } from './config/mongoose';
import ticketsRouter from './routes/tickets';

connectMongo();               

const app = express();
app.use(express.json());
app.use('/tickets', ticketsRouter);

const server = app.listen(3000, () =>
  console.log('API on http://localhost:3000'),
);

const shutdown = () => {
  console.log('\nShutting down…');
  server.close(() => mongoConnection.close(false).then(() => process.exit(0)));
};
process.on('SIGINT', shutdown).on('SIGTERM', shutdown);
