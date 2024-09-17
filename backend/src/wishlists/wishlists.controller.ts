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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from '../guards/jwt.guards';
import { ReqUser, ReqUserId } from '../decorators/decorators';
import { User } from '../users/entities/user.entity';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto, @ReqUser() user: User) {
    return this.wishlistsService.create(createWishlistDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @ReqUserId() userId: string,
  ) {
    return this.wishlistsService.update(+id, updateWishlistDto, +userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @ReqUserId() userId: string) {
    return this.wishlistsService.remove(+id, +userId);
  }
}
