import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IAssignor, IMessage, IReceivable } from '@shared/interfaces';
import { CreateAssignorDto } from './dto/create-assignor.dto';
import { CreateReceivableDto } from './dto/create-receivable.dto';
import { UpdateAssignorDto } from './dto/update-assignor.dto';
import { UpdateReceivableDto } from './dto/update-receivable.dto';
import { IntegrationsService } from './integrations.service';

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Post('payable')
  async createPayable(
    @Body()
    payload: {
      assignor: CreateAssignorDto;
      receivable: CreateReceivableDto;
    },
  ): Promise<IMessage> {
    try {
      return await this.integrationsService.createPayable(payload);
    } catch (err) {
      throw new HttpException(
        'Erro ao criar recebivel.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('payable/:id')
  async findOnePayable(@Param('id') id: string): Promise<IReceivable> {
    try {
      return await this.integrationsService.findOneReceivable(id);
    } catch (err) {
      throw new HttpException(
        'Erro ao encontrar recebivel.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('payable/:id')
  async updatePayable(
    @Param('id') id: string,
    @Body() payload: UpdateReceivableDto,
  ): Promise<IReceivable> {
    try {
      return await this.integrationsService.updateReceivable(payload, id);
    } catch (err) {
      throw new HttpException(
        'Erro ao atualizar recebivel.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('assignor/:id')
  async findOneAssignor(@Param('id') id: string): Promise<IAssignor> {
    try {
      return await this.integrationsService.findOneAssignor(id);
    } catch (err) {
      throw new HttpException(
        'Erro ao encontrar cedente.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('assignor/:id')
  async updateAssignor(
    @Param('id') id: string,
    @Body() payload: UpdateAssignorDto,
  ): Promise<IAssignor> {
    try {
      return await this.integrationsService.updateAssignor(payload, id);
    } catch (err) {
      throw new HttpException(
        'Erro ao atualizar cedente.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
