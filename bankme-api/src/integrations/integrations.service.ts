import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Assignor } from '@prisma/client';
import { IAssignor, IMessage, IReceivable } from '@shared/interfaces';
import { PrismaService } from '@shared/services';
import { PayableDto } from './dto/payable.dto';
import { UpdateAssignorDto } from './dto/update-assignor.dto';
import { UpdateReceivableDto } from './dto/update-receivable.dto';

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

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
}
