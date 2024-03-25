import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, Length } from 'class-validator';
import { AbstractEntity } from '../../abstract.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';

@Entity('article')
export class ArticleEntity extends AbstractEntity {
  @ApiProperty({ type: String, maxLength: 40, minLength: 1 })
  @IsString()
  @Length(1, 40)
  @Column('varchar')
  title: string;

  @ApiProperty({ type: String })
  @IsString()
  @Column('varchar')
  description: string;

  @ApiProperty({ type: () => UserEntity })
  @Type(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.articles, { eager: true })
  user: UserEntity;

  @ApiProperty({ type: Date })
  @CreateDateColumn()
  createdAt: Date;

  constructor(partial: Partial<ArticleEntity>) {
    super();
    Object.assign(this, partial);
  }
}
