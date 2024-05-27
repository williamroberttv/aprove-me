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
import { Ctx, EventPattern, RmqContext } from '@nestjs/microservices';
import { IAssignor, IMessage, IReceivable } from '@shared/interfaces';
import { RABBITMQ_QUEUE } from '@shared/utils';
import { PayableDto } from './dto/payable.dto';
import { UpdateAssignorDto } from './dto/update-assignor.dto';
import { UpdateReceivableDto } from './dto/update-receivable.dto';
import { IntegrationsService } from './integrations.service';

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Post('payable')
  async createPayable(
    @Body()
    payload: PayableDto,
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

  @Post('payable/batch')
  async createPayables(@Body() payload: PayableDto[]): Promise<IMessage> {
    try {
      return await this.integrationsService.createPayables(payload);
    } catch (err) {
      throw new HttpException(
        'Erro ao criar recebiveis.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @EventPattern(RABBITMQ_QUEUE)
  async handlePayable(@Ctx() ctx: RmqContext): Promise<void> {
    const channel = ctx.getChannelRef();
    const content = ctx.getMessage().content.toString('utf-8');
    try {
      await this.integrationsService.createPayableFromQueue(content);
      // await channel.ack(ctx.getMessage());
    } catch (err) {
      await channel.nack(ctx.getMessage(), false, false);
      throw new HttpException(
        'Erro ao criar recebivel',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
