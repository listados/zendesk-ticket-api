import request from 'supertest';
import app from '../index';

const allowedDomain = 'https://www.seudominio.com';
const API_KEY = process.env.API_KEY || 'chave-super-secreta-123';

describe('API CORS Tests', () => {
  it('should allow access from the allowed domain', async () => {
    const response = await request(app)
      .get('/tickets')
      .set('Origin', allowedDomain)
      .set('X-API-Key', API_KEY);

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe(allowedDomain);
  });

  it('should reject access from a non-allowed domain', async () => {
    const response = await request(app)
      .get('/tickets')
      .set('Origin', 'https://nao-autorizado.com')
      .set('X-API-Key', API_KEY);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Acesso de domínio não permitido');
  });
});

describe('Ticket API Tests', () => {
  it('should return all tickets', async () => {
    const response = await request(app)
      .get('/tickets')
      .set('X-API-Key', API_KEY);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return a ticket by ID', async () => {
    const ticketId = 12868; 
    const response = await request(app)
      .get(`/tickets/${ticketId}`)
      .set('X-API-Key', API_KEY);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(ticketId);
  });
});
