import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginData: AuthDto): Promise<any> {
    return this.authService.login(loginData);
  }

  @Get('valid-token/:token')
  async validToken(@Param('token') token: string): Promise<any> {
    console.log(token);
    // return this.authService.validToken(token);
  }
}
