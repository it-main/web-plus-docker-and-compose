import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
  ) {}

  async findAll() {
    const wishlists = await this.wishlistsRepository.find();
    if (!wishlists.length) {
      throw new NotFoundException('Вишлистов нет!');
    }
    return wishlists;
  }

  async create(createWishlistDto: CreateWishlistDto, owner: User) {
    const { itemsId, ...wishlistDto } = createWishlistDto;
    const items = itemsId.map((id) => ({ id }));
    const wishlist = this.wishlistsRepository.create({
      ...wishlistDto,
      owner,
      items,
    });
    await this.wishlistsRepository.save(wishlist);
    return this.findOne(wishlist.id);
  }

  async findOne(id: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });
    if (!wishlist) {
      throw new NotFoundException(`Вишлист с id ${id} не найден`);
    }
    return wishlist;
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.findOne(id);
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Нельзя редактировать чужой вишлист!');
    }
    const { itemsId, ...wishlistDto } = updateWishlistDto;
    let entityWishlist: {
      id: number;
      name: string;
      image: string;
      description: string;
      items?: { id: number }[];
    } = { ...wishlistDto, id };
    if (itemsId) {
      const items = itemsId.map((id) => ({ id }));
      entityWishlist = { ...entityWishlist, items };
    }
    await this.wishlistsRepository.save({ ...entityWishlist });
    return this.findOne(id);
  }

  async remove(id: number, userId: number) {
    const wishlist = await this.findOne(id);
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Нельзя удалять чужой вишлист!');
    }
    await this.wishlistsRepository.delete(id);
    return wishlist;
  }
}
