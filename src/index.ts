import express from 'express';
import ticketsRouter from './routes/tickets';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/tickets', ticketsRouter);

app.listen(port, () => {
  console.log(`🚀 Zendesk Ticket API rodando na porta ${port}`);
});
