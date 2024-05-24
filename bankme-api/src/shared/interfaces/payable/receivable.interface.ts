import { IAssignor } from './assignor.interface';

export interface IReceivable {
  id?: string;
  value: number;
  emissionDate: Date;
  assignorId: string;
  assignor?: IAssignor;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
