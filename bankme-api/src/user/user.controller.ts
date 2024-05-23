import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { IUser } from '@shared/interfaces';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('')
  async getAllUser(): Promise<IUser[]> {
    return this.userService.findAll();
  }
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<IUser> {
    return this.userService.findOne(id);
  }

  @Post()
  async createUser(@Body() payload: CreateUserDto): Promise<IUser> {
    return new Promise((res) => res(payload as IUser));
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() payload: UpdateUserDto,
  ): Promise<IUser> {
    console.log(id);
    return new Promise((res) => res(payload as IUser));
  }
}
