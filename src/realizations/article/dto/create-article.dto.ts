import { OmitType } from '@nestjs/swagger';
import { ArticleEntity } from '../entities/article.entity';

export class CreateArticleDto extends OmitType(ArticleEntity, [
  'id',
  'user',
  'createdAt',
]) {}
