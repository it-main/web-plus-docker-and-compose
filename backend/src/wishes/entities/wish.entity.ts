import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString, IsUrl, Length } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { MainEntity } from '../../main.entity';

@Entity()
export class Wish extends MainEntity {
  @Column()
  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsNotEmpty()
  @IsUrl()
  link: string;

  @Column()
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  raised: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  @Length(1, 1024)
  description: string;

  @ManyToOne(() => User, (user) => user.wishes, { eager: true })
  @JoinColumn()
  owner: User;

  // массив ссылок на заявки скинуться от других пользователей.
  @OneToMany(() => Offer, (offer) => offer.item, { eager: true })
  offers: Offer[];

  @Column({ default: 0 })
  copied: number;
}
