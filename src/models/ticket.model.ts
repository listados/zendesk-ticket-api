import mongoose, { Schema, Document } from 'mongoose';

export interface IUser {
  id: number;
  name: string;
  email: string;
}

export interface IAttachment {
  file_name: string;
  content_url: string;
  save_path: string;
}

export interface IComment {
  author: IUser;
  public: boolean;
  body: string;
  created_at: Date;
  attachments: IAttachment[];
}

export interface ITicket extends Document {
  id: number;
  subject: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  tags: string[];
  group: object;
  assignee: object;
  organization: object | null;
  satisfaction_rating: object;
  url: string;
  due_at: Date | null;
  created_at: Date;
  updated_at: Date;
  via: string;
  custom_fields: object[];
  requester: IUser;
  comments: IComment[];
}

const UserSchema = new Schema<IUser>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true }
});

const AttachmentSchema = new Schema<IAttachment>({
  file_name: { type: String, required: true },
  content_url: { type: String, required: true },
  save_path: { type: String, required: true }
});

const CommentSchema = new Schema<IComment>({
  author: { type: UserSchema, required: true },
  public: { type: Boolean, required: true },
  body: { type: String, required: true },
  created_at: { type: Date, required: true },
  attachments: [AttachmentSchema]
});

const TicketSchema = new Schema<ITicket>({
  id: { type: Number, required: true }, // ID do ticket
  subject: { type: String, required: true }, // Assunto
  description: { type: String, required: true }, // Descrição
  type: { type: String, required: true }, // Tipo de ticket
  priority: { type: String, required: true }, // Prioridade
  status: { type: String, required: true }, // Status do ticket
  tags: [String], // Tags associadas ao ticket
  group: { type: Object, required: true }, // Grupo responsável
  assignee: { type: Object, required: true }, // Responsável pela tarefa
  requester: { type: UserSchema, required: true }, // Solicitante

  // Comentado: Campos que não são essenciais para uma consulta simples
  // organization: { type: Object, default: null }, // Organização associada ao ticket
  // satisfaction_rating: { type: Object, required: true }, // Avaliação de satisfação
  // url: { type: String, required: true }, // URL do ticket
  // due_at: { type: Date, default: null }, // Data de vencimento
  // created_at: { type: Date, required: true }, // Data de criação
  // updated_at: { type: Date, required: true }, // Data de atualização
  // via: { type: String, required: true }, // Origem do ticket (email, chat, etc)
  // custom_fields: { type: [Object], required: true }, // Campos personalizados

  comments: [CommentSchema] 
});

const Ticket = mongoose.model<ITicket>('Ticket', TicketSchema, 'tickets');

export default Ticket;
