import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async signIn(authData: AuthDto): Promise<any> {
    try {
      const { login, password } = authData;
      const user = await this.userService.validateUser(login, password);

      if (!user) {
        throw new HttpException(
          'Credenciais inválidas.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const jwt = {
        access_token: await this.jwtService.signAsync({ id: user.id }),
      };

      return jwt;
    } catch (error) {
      throw new HttpException(
        'Falha ao autenticar usuário.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  validToken(token: string): { id: string } {
    try {
      const valid: { id: string } = this.jwtService.verify<{
        id: string;
      }>(token);

      if (!valid) {
        throw new HttpException(
          'Credenciais inválidas.',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return valid;
    } catch (error) {
      throw new HttpException(
        'Falha ao validar usuário.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
