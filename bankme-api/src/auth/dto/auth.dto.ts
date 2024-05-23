import { IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsNotEmpty({ message: 'login: Campo senha é obrigatório.' })
  login: string;
  @IsNotEmpty({ message: 'password: Campo senha é obrigatório.' })
  password: string;
}
