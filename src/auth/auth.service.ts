import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignupDTO } from './dto/signup.dto';
import { UserService } from '../user/user.service';
import { SigninDTO } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  /**
   * Signup user with name, email and password
   */
  async signup(data: SignupDTO) {
    const salt = await bcrypt.genSalt(10);
    const hashpwd = await bcrypt.hash(data.password, salt);

    data.password = hashpwd;

    await this.userService.create(data); // create a user
    return { message: 'SUCCESS' };
  }

  /**
   * Signin user with email and password
   * @param data
   */
  async signin(data: SigninDTO) {
    return data;
  }
}
