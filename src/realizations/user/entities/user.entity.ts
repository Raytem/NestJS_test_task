import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';
import { AbstractEntity } from '../../abstract.entity';
import { ArticleEntity } from '../../article/entities/article.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';

@Entity('user')
export class UserEntity extends AbstractEntity {
  @ApiProperty({ type: String })
  @IsEmail()
  @Index('IDX_USER_EMAIL')
  @Column('varchar', { unique: true })
  email: string;

  @ApiProperty({ type: String, minLength: 1, maxLength: 35 })
  @IsString()
  @Length(1, 35)
  @Column('varchar')
  name: string;

  @Exclude()
  @IsString()
  @Length(4, 32)
  @Column('varchar')
  password: string;

  @OneToMany(() => ArticleEntity, (article) => article.user, {
    onDelete: 'CASCADE',
  })
  articles: ArticleEntity[];

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
