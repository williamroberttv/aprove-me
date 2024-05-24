import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateAssignorDto {
  @IsNotEmpty({ message: 'document: O nome do cedente é obrigatório.' })
  @MaxLength(30, {
    message:
      'document: O documento do cedente deve ter no máximo 30 caracteres.',
  })
  document: string;

  @IsNotEmpty({ message: 'email: O email do cedente é obrigatório.' })
  @MaxLength(140, {
    message: 'email: O email do cedente deve ter no máximo 140 caracteres.',
  })
  email: string;

  @IsNotEmpty({ message: 'phone: O telefone do cedente é obrigatório.' })
  @MaxLength(20, {
    message: 'phone: O telefone do cedente deve ter no máximo 20 caracteres.',
  })
  phone: string;

  @IsNotEmpty({ message: 'name: O nome do cedente é obrigatório.' })
  @MaxLength(140, {
    message: 'name: O nome do cedente deve ter no mínimo 140 caracteres.',
  })
  name: string;
}
