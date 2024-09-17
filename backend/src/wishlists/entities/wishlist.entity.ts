import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';
import { MainEntity } from '../../main.entity';

@Entity()
export class Wishlist extends MainEntity {
  @Column()
  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @Column({ default: '' })
  @IsString()
  @MaxLength(1500)
  @IsOptional()
  description: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
