import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import cors, { CorsOptions } from 'cors';
import { connectMongo } from './config/mongoose';
import ticketsRouter from './routes/tickets';
import path from 'path';

const app = express();

const allowedDomain = 'https://www.seudominio.com';

// Configuração do CORS
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    console.log('Verificando origem:', origin);  // Log da origem

    if (!origin || origin === allowedDomain) {
      callback(null, true);  // Permite a requisição
    } else {
      console.log('Rejeitado domínio não permitido:', origin); // Log do domínio não permitido
      // Bloqueia a requisição com status 403
      callback(new Error('Acesso de domínio não permitido'), false);
    }
  },
};

// Tipagem do middleware de erro (não retorna nada)
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('Erro detectado:', err);  // Log do erro para depuração

  // Se o erro for de CORS, responder com 403
  if (err.message === 'Acesso de domínio não permitido') {
    // Apenas envia o status 403 e a mensagem de erro, sem retornar nada
    res.status(403).json({ message: 'Acesso de domínio não permitido' });
  } else {
    // Se o erro não for relacionado ao CORS, passa para o próximo middleware
    next(err);
  }
};

app.use(cors(corsOptions)); // Usando a configuração CORS
app.use(express.json());
app.use('/tickets', ticketsRouter); // Suas rotas de tickets

app.use(errorHandler);

// Conectando ao MongoDB
connectMongo();

// Iniciando o servidor HTTP
const server = app.listen(3000, () =>
  console.log('API rodando em http://localhost:3000')
);

// Shutdown
const shutdown = () => {
  console.log('\nShutting down…');
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown).on('SIGTERM', shutdown);
