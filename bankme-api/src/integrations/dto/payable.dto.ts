import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateAssignorDto } from './create-assignor.dto';
import { CreateReceivableDto } from './create-receivable.dto';

export class PayableDto {
  @ValidateNested()
  @Type(() => CreateAssignorDto)
  assignor: CreateAssignorDto;

  @ValidateNested()
  @Type(() => CreateReceivableDto)
  receivable: CreateReceivableDto;
}
