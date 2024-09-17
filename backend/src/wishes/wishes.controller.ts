import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from '../guards/jwt.guards';
import { User } from '../users/entities/user.entity';
import { ReqUser, ReqUserId } from '../decorators/decorators';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @ReqUser() user: User) {
    return this.wishesService.create(createWishDto, user);
  }

  @Get('last')
  getLast() {
    return this.wishesService.getLast();
  }

  @Get('top')
  getTop() {
    return this.wishesService.getTop();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getWishById(@Param('id') id: string) {
    return this.wishesService.getWishById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
    @ReqUserId() userId: string,
  ) {
    return this.wishesService.update(+id, updateWishDto, +userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @ReqUserId() userId: string) {
    return this.wishesService.remove(+id, +userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  copy(@Param('id') id: string, @ReqUser() user: User) {
    return this.wishesService.copy(+id, user);
  }
}
