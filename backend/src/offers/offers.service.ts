import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { DataSource, Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private readonly dataSource: DataSource,
  ) {}
  async create(createOfferDto: CreateOfferDto, user: User) {
    const wish = await this.wishesService.getWishById(createOfferDto.itemId);
    if (wish.owner.id === user.id) {
      throw new ForbiddenException(
        'Вы не можете скидываться на собственные подарки',
      );
    }
    const need = wish.price - wish.raised;
    if (need <= 0) {
      throw new ForbiddenException('Необходимая сумма уже собрана, спасибо!');
    }
    if (createOfferDto.amount > need) {
      throw new ForbiddenException(
        `Уменьшите сумму, осталось собрать только ${need}!`,
      );
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const offer = this.offersRepository.create({
        ...createOfferDto,
        item: wish,
        user,
      });
      await this.offersRepository.save(offer);
      const newRaised = Number(wish.raised) + Number(createOfferDto.amount);
      await this.wishesService.updateRaised(wish.id, newRaised);
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return {};
  }

  async findAll() {
    const offers = await this.offersRepository.find({
      relations: [
        'item',
        'user',
        'user.wishes',
        'user.offers',
        'user.wishlists',
      ],
    });
    if (!offers.length) {
      throw new NotFoundException('Еще никто не скидывался!');
    }
    return offers;
  }

  async findOne(id: number) {
    const offer = await this.offersRepository.findOne({
      where: { id },
      relations: [
        'item',
        'user',
        'user.wishes',
        'user.offers',
        'user.wishlists',
      ],
    });
    if (!offer) {
      throw new NotFoundException('Такого предложения не существует');
    }
    return offer;
  }
}
