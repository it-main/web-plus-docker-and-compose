import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReqUserId } from '../decorators/decorators';
import { JwtAuthGuard } from '../guards/jwt.guards';
import { FindUserDto } from './dto/find-user.dto';
import { NotUniqueFilter } from '../filteres/exceptions.filter';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getUserById(@ReqUserId() id: number) {
    return this.usersService.findUserById(id);
  }

  @UseFilters(NotUniqueFilter)
  @Patch('me')
  updateUser(@Body() updateUserDto: UpdateUserDto, @ReqUserId() id: number) {
    return this.usersService.update(id, updateUserDto);
  }

  @Get('me/wishes')
  getWishes(@ReqUserId() id: number) {
    return this.usersService.getWishes(id);
  }

  @Get(':username')
  getUserByUsername(@Param('username') username: string) {
    return this.usersService.getUserByUsername(username);
  }

  @Get(':username/wishes')
  getWishesByUsername(@Param('username') username: string) {
    return this.usersService.getWishesByUsername(username);
  }

  @Post('find')
  findMany(@Body() findUserDto: FindUserDto) {
    return this.usersService.findMany(findUserDto);
  }
}
