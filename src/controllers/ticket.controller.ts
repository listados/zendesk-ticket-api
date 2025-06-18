import { Request, Response } from 'express';
import { TicketService } from '../services/ticket.service';
import asyncHandler from '../utils/asyncHandler';

export class TicketController {
  private ticketService: TicketService;

  constructor() {
    this.ticketService = new TicketService();
  }

  public getAllTickets = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const tickets = await this.ticketService.getAllTickets();
    return res.status(200).json(tickets);
  });

  public getTicketById = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const ticketId = parseInt(req.params.id, 10);

    if (isNaN(ticketId)) {
      return res.status(400).json({ message: 'Id inválido' });
    }

    const ticket = await this.ticketService.getTicketById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket não encontrado' });
    }
    return res.status(200).json(ticket);
  });

  public getTicketsWithFilters = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const filters = req.query; 
    const tickets = await this.ticketService.getTicketsWithFilters(filters);
    return res.status(200).json(tickets);
  });
}
