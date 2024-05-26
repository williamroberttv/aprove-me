import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy, RmqContext } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Assignor } from '@prisma/client';
import { IAssignor, IMessage, IReceivable } from '@shared/interfaces';
import { PrismaService } from '@shared/services';
import { MAX_BATCHES, MAX_RETRIES } from '@shared/utils';
import { PayableDto } from './dto/payable.dto';
import { UpdateAssignorDto } from './dto/update-assignor.dto';
import { UpdateReceivableDto } from './dto/update-receivable.dto';

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    @Inject('PAYABLE_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async sendPayablesToQueue(): Promise<void> {
    try {
      const batches = await this.prismaService.batchesPayable.findMany({
        where: {
          attempts: {
            lt: MAX_RETRIES,
          },
        },
      });
      for (const batch of batches) {
        this.client.emit('payable', {
          payable: batch.message,
          batchId: batch.id,
        });
      }
      this.logger.log('[CronJob]: Enviando batches para fila!');
    } catch (err) {
      this.logger.log(err);
      throw new HttpException(
        'Erro ao enviar batches para fila',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createPayable(payload: PayableDto): Promise<IMessage> {
    try {
      await this.prismaService.$transaction(async (prisma) => {
        const { receivable } = payload;
        let assignor: Assignor;
        assignor = await prisma.assignor.findFirst({
          where: {
            document: payload.assignor.document,
          },
        });

        if (!assignor) {
          assignor = await prisma.assignor.create({
            data: payload.assignor,
          });
        }

        const receivableData = {
          ...receivable,
          assignorId: assignor.id,
        };

        await prisma.receivable.create({
          data: receivableData,
        });
      });

      return { message: 'Recebivel criado com sucesso!' };
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(
        'Erro ao criar recebivel',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllAssignors(): Promise<IAssignor[]> {
    try {
      return await this.prismaService.assignor.findMany();
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(
        'Erro ao buscar cedentes',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneAssignor(id: string): Promise<IAssignor> {
    try {
      return await this.prismaService.assignor.findFirst({
        where: {
          id: id,
        },
      });
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(
        'Erro ao buscar cedentes',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateAssignor(
    payload: UpdateAssignorDto,
    id: string,
  ): Promise<IAssignor> {
    try {
      const result = await this.prismaService.$transaction(async (prisma) => {
        const assignor = await prisma.assignor.findFirst({
          where: {
            id: id,
          },
        });

        if (!assignor) {
          throw new HttpException(
            'Cedente não encontrado',
            HttpStatus.BAD_REQUEST,
          );
        }

        return await prisma.assignor.update({
          where: {
            id: id,
          },
          data: payload,
        });
      });
      return result;
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(
        'Erro ao atualizar cedente',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  findAllReceivables(): Promise<IReceivable[]> {
    try {
      return this.prismaService.receivable.findMany();
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(
        'Erro ao buscar recebiveis',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  findOneReceivable(id: string): Promise<IReceivable> {
    try {
      return this.prismaService.receivable.findFirst({
        where: {
          id: id,
        },
      });
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(
        'Erro ao buscar recebivel',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateReceivable(
    payload: UpdateReceivableDto,
    id: string,
  ): Promise<IReceivable> {
    try {
      const result = await this.prismaService.$transaction(async (prisma) => {
        const receivable = await prisma.receivable.findFirst({
          where: {
            id: id,
          },
        });

        if (!receivable) {
          throw new HttpException(
            'Recebivel não encontrado',
            HttpStatus.BAD_REQUEST,
          );
        }

        return await prisma.receivable.update({
          where: {
            id: id,
          },
          data: payload,
        });
      });
      return result;
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(
        'Erro ao atualizar recebivel',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createPayables(payload: PayableDto[]): Promise<IMessage> {
    try {
      if (payload.length > MAX_BATCHES) {
        throw new HttpException(
          'Limite de 10.000 recebiveis por vez.',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.prismaService.$transaction(async (prisma) => {
        const batch = await prisma.batch.create({
          data: {
            totalJobs: payload.length,
          },
        });

        for (const payable of payload) {
          await prisma.batchesPayable.create({
            data: {
              batchId: batch.id,
              message: JSON.stringify(payable),
            },
          });
        }
      });

      return { message: 'Recebiveis criados com sucesso!' };
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(
        'Erro ao criar recebiveis',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createPayableFromQueue(
    message: string,
    ctx: RmqContext,
  ): Promise<IMessage> {
    const payload: { payable: PayableDto; batchId: string } =
      JSON.parse(message);
    try {
      if (!payload.payable) {
        throw new HttpException('Payload inválido', HttpStatus.BAD_REQUEST);
      }
      return await this.createPayable(payload.payable);
    } catch (err) {
      this.logger.error(err);
      const batchesPayable = await this.prismaService.batchesPayable.update({
        where: {
          id: payload.batchId,
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });
      if (batchesPayable.attempts >= MAX_RETRIES) {
        const channel = ctx.getChannelRef();
        channel.sendToQueue(
          process.env.RABBITMQ_QUEUE + '_DLQ',
          Buffer.from(JSON.stringify(payload)),
          {
            headers: { 'x-attempts': batchesPayable.attempts },
          },
        );
      }
      throw new HttpException(
        'Erro ao criar recebivel',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
