import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a user with name, email and password
   * @param data
   * @returns
   */
  async create(data: CreateUserDto): Promise<User> {
    // check is user exists
    const getUser = await this.findOne(data.email);
    if (getUser) throw new Error('Users already exists at this email');

    const newUser = await this.prisma.user.create({ data: data });
    return newUser;
  }

  /**
   * Get users by
   * @returns a array of users
   */
  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({});
    return users;
  }

  /**
   * Get one user by email or user id
   * @param search email or user id
   * @returns a object of user or null
   */
  async findOne(search: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ id: search }, { email: search }] },
    });
    return user;
  }

  // update user
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    return updatedUser;
  }

  // delete user
  async remove(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return { message: 'USER DELETED' };
  }
}
