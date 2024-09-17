import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { DataSource, Repository } from 'typeorm';
import { JwtAuthGuard } from '../guards/jwt.guards';
import { User } from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private readonly dataSource: DataSource,
  ) {}

  async updateRaised(id: number, raised: number) {
    return await this.wishesRepository.update(id, { raised });
  }

  async create(createWishDto: CreateWishDto, owner: User) {
    return await this.wishesRepository.save({ ...createWishDto, owner });
  }

  async getLast() {
    return await this.wishesRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
    });
  }

  async getTop() {
    return await this.wishesRepository.find({
      take: 20,
      order: { copied: 'DESC' },
    });
  }

  async getWishById(id: number) {
    const wish = await this.wishesRepository.findOneBy({ id });
    if (!wish) {
      throw new NotFoundException(`Подарок с id ${id} не найден`);
    }
    return wish;
  }

  async update(id: number, updateWishDto: UpdateWishDto, userId: number) {
    const wish = await this.getWishById(id);
    if (wish.owner.id !== userId) {
      throw new ForbiddenException(`Можно редактировать только свои подарки!`);
    } else if (
      wish.raised &&
      updateWishDto.price &&
      +wish.price !== updateWishDto.price
    ) {
      throw new ForbiddenException(
        'На подарок уже скинулись, теперь цену нельзя изменить!',
      );
    }
    await this.wishesRepository.update(id, updateWishDto);
    return this.getWishById(id);
  }

  async remove(id: number, userId: number) {
    const wish = await this.getWishById(id);
    if (wish.owner.id !== userId) {
      throw new ForbiddenException(`Можно удалить только свой подарок!`);
    }
    await this.wishesRepository.delete(id);
    return {};
  }

  async copy(wishId: number, user: User) {
    const wish = await this.getWishById(wishId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, copied, raised, createdAt, updatedAt, ...wishDto } = wish;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let copyWish = undefined;
    try {
      copyWish = await this.create({ ...wishDto }, user);
      await this.wishesRepository.update(
        { id: wishId },
        { copied: wish.copied + 1 },
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return copyWish;
  }
}
