import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { PaginationModule } from 'src/pagination/pagination.module';
import { ArticleCacheService } from './article.cache-service';

@Module({
  imports: [PaginationModule, TypeOrmModule.forFeature([ArticleEntity])],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleCacheService],
})
export class ArticleModule {}
