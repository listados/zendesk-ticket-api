import { ITicketRepository } from '../interfaces/ticketRepositoryInterface';
import Ticket, { ITicket } from '../models/ticket.model';  
import { BaseRepository } from './baseRepository';

export class TicketRepository extends BaseRepository<ITicket> implements ITicketRepository {
  constructor() {
    super(Ticket); 
  }

  async findByIdTicket(id: number): Promise<ITicket | null> {
    const model = this.getModel();  
    const tickets = await model.find({ id }).lean().select('id subject description type priority status tags group assignee requester comments'); 
    return tickets.length > 0 ? tickets[0] : null;
  }

  async findByRequesterEmail(email: string): Promise<ITicket | null> {
    try {
      const model = this.getModel();  
      const ticket = await model.findOne({ 'requester.email': email }).lean().select('id subject description type priority status tags group assignee requester comments');
      return ticket;  
    } catch (err) {
      throw new Error(`Erro ao buscar o ticket pelo email ${email}: ${err}`);
    }
  }

  async find(filters: any): Promise<ITicket[]> {
    try {
      const model = this.getModel();
      // Verifica se o filtro contém 'requester.name' ou 'requester.email'
      const hasRequesterName = 'requester.name' in filters;
      const hasRequesterEmail = 'requester.email' in filters;

      console.log('Filtros recebidos:', {
        hasRequesterName,
        hasRequesterEmail,
        filters
      });

      // Exemplo: Se quiser tratar diferentemente para cada caso
      if (hasRequesterName) {
        console.log('Filtrando por nome do solicitante:', filters['requester.name']);
        // Você pode aplicar transformações específicas, como case-insensitive
        filters['requester.name'] = new RegExp(filters['requester.name'], 'i');
      }

      if (hasRequesterEmail) {
        console.log('Filtrando por e-mail do solicitante:', filters['requester.email']);
        // Validação básica de e-mail (opcional)
        if (!filters['requester.email'].includes('@')) {
          throw new Error('Formato de e-mail inválido.');
        }
      }

      return await model.find(filters)
        .lean()
        .select('id subject description type priority status tags group assignee requester comments'); 
    } catch (err) {
      throw new Error(`Erro ao buscar tickets com os filtros: ${err}`);
    }
  }
}
