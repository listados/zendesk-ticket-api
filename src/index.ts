import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectMongo } from './config/mongoose';
import ticketsRouter from './routes/tickets';

dotenv.config();

const app = express();

const allowedDomain = process.env.ALLOWED_DOMAIN || 'https://www.seudominio.com';
const API_KEY = process.env.API_KEY || 'minha-chave-secreta';

const blockInvalidOrigins = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const origin = req.headers.origin;
  if (origin && origin !== allowedDomain) {
    res.status(403).json({ message: 'Acesso de domínio não permitido' });
    return;
  }
  next();
};

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin === allowedDomain) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
};

const verifyApiKey = (req: Request, res: Response, next: NextFunction): void => {
  const key = req.header('X-API-Key');

  if (!key || key !== API_KEY) {
    res.status(401).json({ message: 'Chave de API inválida ou ausente' });
    return;
  }
  next();
};

const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
): void => {
  console.error('Erro detectado:', err);
  res.status(500).json({ message: 'Erro interno do servidor' });
};
app.use(express.static(path.join(__dirname, '../public')));
app.use(blockInvalidOrigins);
app.use(cors(corsOptions));
app.use(express.json());
app.use(verifyApiKey);
app.use('/tickets', ticketsRouter);
app.use(errorHandler);

connectMongo();

const server = app.listen(3000, () =>
  console.log('API rodando em http://localhost:3000')
);

const shutdown = () => {
  console.log('\nShutting down…');
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown).on('SIGTERM', shutdown);

export default app; 
