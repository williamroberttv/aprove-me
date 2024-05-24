import { IReceivable } from './receivable.interface';

export interface IAssignor {
  id?: string;
  document: string;
  name: string;
  email: string;
  phone: string;
  receivables?: IReceivable[];
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
