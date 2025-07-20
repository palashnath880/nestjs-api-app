import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDTO } from './dto/signup.dto';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { SigninDTO } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('signup')
  async singup(@Body() data: SignupDTO, @Res() res: Response) {
    try {
      // first check the user
      const getUser = await this.userService.findOne(data.email);
      if (getUser) {
        return res
          .status(HttpStatus.CONFLICT)
          .send({ message: `user exists at this email` });
      }

      const result = await this.authService.signup(data);
      return res.status(HttpStatus.CREATED).send(result);
    } catch (err: any) {
      throw new HttpException(err['message'], HttpStatus.BAD_GATEWAY, {
        cause: err,
      });
    }
  }

  @Post('signin')
  async signin(@Body() data: SigninDTO, @Res() res: Response) {
    try {
      // check user exists
      const getUser = await this.userService.findOne(data.email);
      if (!getUser) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send({ message: `User not found.` });
      }

      // compare user password
      const comparePWD = await bcrypt.compare(data.password, getUser.password);
      if (!comparePWD) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send({ message: 'Incorrect Password' });
      }

      await this.authService.signin(data);
    } catch (err: any) {
      throw new HttpException(err['message'], HttpStatus.BAD_GATEWAY, {
        cause: err,
      });
    }
  }
}
