import { IBaseRepository } from './baseRepositoryInterface';

export interface ITicketRepository extends IBaseRepository<any> {
  findByIdTicket(id: number): Promise<any | null>;
  findByRequesterEmail(email: string): Promise<any | null>;
  find(filters: any): Promise<any[]>;
}
