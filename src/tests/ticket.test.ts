import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { connectMongo } from '../config/mongoose'; // Caminho para sua configuração do mongoose
import ticketsRouter from '../routes/tickets'; // Rota de tickets

const app = express();

const allowedDomain = 'https://www.seudominio.com';

const corsOptions: cors.CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    console.log('Verificando origem:', origin);  // Verificando a origem

    if (!origin || origin === allowedDomain) {
      callback(null, true);  // Permite a requisição
    } else {
      console.log('Rejeitado domínio não permitido:', origin); // Log do domínio não permitido
      callback(new Error('Acesso de domínio não permitido'), false);  // Rejeita a requisição
    }
  },
};

app.use(cors(corsOptions)); // Usando a configuração CORS
app.use(express.json());
app.use('/tickets', ticketsRouter); // Suas rotas de tickets

// Conectando ao MongoDB
beforeAll(() => connectMongo());

describe('API CORS Tests', () => {
  it('should allow access from the allowed domain', async () => {
    const response = await request(app)
      .get('/tickets')
      .set('Origin', 'https://www.seudominio.com'); // Definindo o domínio permitido

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe(allowedDomain); // Verifica se o CORS permite o domínio
  });

  it('should reject access from a non-allowed domain', async () => {
    const response = await request(app)
      .get('/tickets')
      .set('Origin', 'https://www.outrodominio.com'); // Outro domínio não permitido

    console.log(response.body);  // Para ajudar na depuração, imprima a resposta

    // Verifica o status 403
    expect(response.status).toBe(403); 

    // Verifica a mensagem de erro no corpo da resposta
    expect(response.body.message).toBe('Acesso de domínio não permitido');
  });
});

// Teste para a rota de tickets
describe('Ticket API Tests', () => {
  it('should return all tickets', async () => {
    const response = await request(app).get('/tickets');
    expect(response.status).toBe(200); // Verifica se a resposta é 200 OK
    expect(Array.isArray(response.body)).toBe(true); // Verifica se o retorno é um array
  });

  it('should return a ticket by ID', async () => {
    const ticketId = 12868; // Altere com um ID válido
    const response = await request(app).get(`/tickets/${ticketId}`);
    
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(ticketId); // Verifica se o ticket com o ID correto é retornado
  });
});
