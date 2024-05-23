import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { IUser, PrismaService } from 'src/shared';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: Logger,
    private readonly prismaService: PrismaService,
  ) {}

  async findAll(): Promise<IUser[]> {
    try {
      return await this.prismaService.user.findMany();
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Falha ao buscar usuários',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async findOne(id: string): Promise<IUser> {
    try {
      return await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Falha ao buscar usuário.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async validateUser(login: string, password: string): Promise<IUser> {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          login,
          password,
        },
      });

      if (!user) {
        throw new HttpException(
          'Usuário não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      return user;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Falha ao validar usuário.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
