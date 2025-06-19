import mongoose, { ConnectOptions } from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

/*―― Configuráveis via .env ―――――――――――――――――――――――――――――――――――*/
const {
  MONGODB_URI,           
  DB_USER,               
  DB_PASSWORD,           
  DB_NAME = 'nomedobanco',      
  AUTH_SOURCE = 'admin', 
} = process.env;

/*―― Opções de retry ―――――――――――――――――――――――――――――――――――――――――*/
interface RetryOpts {
  attempts: number;   // quantas tentativas restantes
  delay: number;      // delay atual em ms
}
const DEFAULT_RETRY: RetryOpts = { attempts: 5, delay: 2_000 };

/*―― Conecta ou tenta novamente ―――――――――――――――――――――――――――――――*/
export function connectMongo(retry: RetryOpts = DEFAULT_RETRY): void {
  if (!MONGODB_URI) {
    console.error('❌  Env var MONGODB_URI não definida.');
    return;
  }
  if (mongoose.connection.readyState === 1) {
    console.log('✅  MongoDB já conectado.');
    return;
  }

  const options: ConnectOptions = {
    dbName: DB_NAME,
    maxPoolSize: 20,
    autoIndex: process.env.NODE_ENV !== 'production',
    serverApi: { version: '1' },
  };
  if (DB_USER && DB_PASSWORD) {
    options.user = DB_USER;
    options.pass = DB_PASSWORD;
    options.authSource = AUTH_SOURCE;
  }

  mongoose
    .connect(MONGODB_URI, options)
    .then(() => console.log('🚀  MongoDB conectado.'))
    .catch(err => {
      if (retry.attempts <= 0) {
        console.error('❌  Falhou após várias tentativas:', err?.message ?? err);
        return;
      }
      console.warn(
        `⚠️  Conexão MongoDB falhou. Tentando novamente em ${retry.delay /
          1000}s… (${retry.attempts} restantes)`,
      );
      setTimeout(
        () =>
          connectMongo({
            attempts: retry.attempts - 1,
            delay: retry.delay * 2, 
          }),
        retry.delay,
      );
    });
}

export const mongoConnection = mongoose.connection;
