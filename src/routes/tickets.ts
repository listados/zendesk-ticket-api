import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';

const router = Router();

const ticketController = new TicketController();

router.get('/', ticketController.getTicketsWithFilters);

router.get('/:id', ticketController.getTicketById);

export default router;
