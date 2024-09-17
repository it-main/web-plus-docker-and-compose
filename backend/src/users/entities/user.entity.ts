import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import { MainEntity } from '../../main.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Exclude, instanceToPlain } from 'class-transformer';
import { hash } from 'bcrypt';

@Entity()
export class User extends MainEntity {
  @Column({ unique: true })
  @IsNotEmpty()
  @IsString()
  @Length(2, 30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsNotEmpty()
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  @IsNotEmpty()
  @IsString()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
