import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: Logger,
    private readonly userService: UserService,
  ) {}
  async login(authData: AuthDto): Promise<any> {
    try {
      const { login, password } = authData;
      const user = await this.userService.validateUser(login, password);

      if (!user) {
        throw new HttpException(
          'Credenciais inválidas.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const jwt = `sioahdioahsiodhasd`;

      return jwt;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
