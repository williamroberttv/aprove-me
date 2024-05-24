import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReceivableDto {
  @IsNotEmpty({ message: 'value: O valor do recebivel é obrigatório.' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'value: O valor do recebivel deve ser um float.' },
  )
  value: number;

  @IsNotEmpty({
    message: 'emissionDate: A data de emissão do recebivel é obrigatório.',
  })
  emissionDate: Date;

  @IsOptional()
  @IsString({ message: 'assignorId: O id do cedente deve ser uma string.' })
  assignorId: string;
}
