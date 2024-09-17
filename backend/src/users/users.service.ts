import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { FindUserDto } from './dto/find-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);
    return user;
  }

  findMany(findUserDto: FindUserDto) {
    return this.usersRepository.find({
      where: [{ email: findUserDto.query }, { username: findUserDto.query }],
    });
  }

  async getUserByUsernameFull(username: string) {
    const user = await this.usersRepository.findOneBy({ username });
    if (!user) {
      throw new NotFoundException(
        `Пользователь с username ${username} не найден`,
      );
    }
    return user;
  }

  async findUserById(id: number) {
    return await this.usersRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let { password } = updateUserDto;
    password = await hash(password, 10);
    await this.usersRepository.save({ id, ...updateUserDto, password });
    return await this.findUserById(id);
  }

  async getWishes(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['wishes'],
    });
    return user.wishes;
  }

  async getUserByUsername(username: string) {
    const user = await this.usersRepository.findOneBy({ username });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, password, ...usr } = user;
    return usr;
  }

  async getWishesByUsername(username: string) {
    const user = await this.usersRepository.findOneBy({ username });
    return user.wishes;
  }
}
