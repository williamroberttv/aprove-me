import { IUser } from '@shared/interfaces';

export class User implements IUser {
  id: string;
  login: string;
  password: string;
}
