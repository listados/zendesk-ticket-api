import { TicketRepository } from '../repositories/ticketRepository';
import { ITicket } from '../models/ticket.model';

export class TicketService {
  private ticketRepository: TicketRepository;

  constructor() {
    this.ticketRepository = new TicketRepository();  
  }

  async getAllTickets(): Promise<ITicket[]> {
    try {
      return await this.ticketRepository.findAll();  
    } catch (err) {
      throw new Error(`Erro ao obter todos os tickets: ${err}`);
    }
  }

  async getTicketById(id: number): Promise<ITicket | null> {  
    try {
      let ticket = await this.ticketRepository.findByIdTicket(id);  
      return ticket;
    } catch (err) {
      throw new Error(`Erro ao buscar o ticket com o id ${id}: ${err}`);
    }
  }

  async getTicketsWithFilters(filters: any): Promise<ITicket[]> {
    try {
      return await this.ticketRepository.find(filters);  
    } catch (err) {
      throw new Error(`Erro ao buscar tickets com os filtros: ${err}`);
    }
  }
}
