import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { NotUniqueFilter } from '../filteres/exceptions.filter';
import { LocalAuthGuard } from '../guards/local.guards';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseFilters(NotUniqueFilter)
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Body() signinUserDto: SigninDto) {
    return this.authService.signin(signinUserDto);
  }
}
