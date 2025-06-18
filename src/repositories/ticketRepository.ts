import { ITicketRepository } from '../interfaces/ticketRepositoryInterface';
import Ticket, { ITicket } from '../models/ticket.model';  
import { BaseRepository } from './baseRepository';

export class TicketRepository extends BaseRepository<ITicket> implements ITicketRepository {
  constructor() {
    super(Ticket); 
  }

  async findByIdTicket(id: number): Promise<ITicket | null> {
    const model = this.getModel();  
    const tickets = await model.find({ id }).lean(); 
    return tickets.length > 0 ? tickets[0] : null;
  }

  async findByRequesterEmail(email: string): Promise<ITicket | null> {
    try {
      const model = this.getModel();  
      const ticket = await model.findOne({ 'requester.email': email }).lean();
      return ticket;  
    } catch (err) {
      throw new Error(`Erro ao buscar o ticket pelo email ${email}: ${err}`);
    }
  }

  async find(filters: any): Promise<ITicket[]> {
    try {
      const model = this.getModel();  
      return await model.find(filters).lean();  
    } catch (err) {
      throw new Error(`Erro ao buscar tickets com os filtros: ${err}`);
    }
  }
}
