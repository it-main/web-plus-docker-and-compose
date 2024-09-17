import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  signup(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  async signin(signinUserDto: SigninDto) {
    const user = await this.validatePassword(signinUserDto);
    return { access_token: this.jwtService.sign({ id: user.id }) };
  }

  async validatePassword(signinUserDto: SigninDto) {
    const { username, password } = signinUserDto;
    const user = await this.userService.getUserByUsernameFull(username);

    if (!user || !(await compare(password, user.password))) {
      throw new UnauthorizedException('Ошибка! Неправильные Логин или Пароль');
    }
    return user;
  }
}
