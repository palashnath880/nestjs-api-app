import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      // check users exists
      const getUser = await this.userService.findOne(createUserDto.email);
      if (getUser) {
        return res
          .status(HttpStatus.CONFLICT)
          .send({ message: `User exists at this email` });
      }

      await this.userService.create(createUserDto);
      res.status(HttpStatus.CREATED).send({ message: 'USER CREATED' });
    } catch (error: any) {
      throw new HttpException(error['message'], HttpStatus.CONFLICT, {
        cause: error,
      });
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
