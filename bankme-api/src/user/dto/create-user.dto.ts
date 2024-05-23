import { IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty({ message: 'email: Campo e-mail é obrigatório.' })
  readonly login: string;

  @IsNotEmpty({ message: 'password: Campo senha é obrigatório.' })
  readonly password: string;
}
