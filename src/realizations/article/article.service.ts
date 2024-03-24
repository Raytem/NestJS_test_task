import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Repository } from 'typeorm';
import { ArticleEntity } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/realizations/user/entities/user.entity';
import { PaginationService } from 'src/pagination/pagination.service';
import { ArticleFilterDto } from './dto/article-filter.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepo: Repository<ArticleEntity>,

    private paginationService: PaginationService,
  ) {}

  async findAll(articleFilterDto: ArticleFilterDto) {
    const pagination = this.paginationService.paginate(articleFilterDto);
    const queryBuilder = this.articleRepo.createQueryBuilder('article');

    queryBuilder.leftJoinAndSelect('article.user', 'user');
    queryBuilder.skip(pagination.skip);
    queryBuilder.take(pagination.take);

    if (articleFilterDto.userId) {
      queryBuilder.andWhere('article.userId = :userId', {
        userId: articleFilterDto.userId,
      });
    }

    if (articleFilterDto.dateFrom) {
      queryBuilder.andWhere('article.createdAt >= :dateFrom', {
        dateFrom: new Date(articleFilterDto.dateFrom),
      });
    }

    if (articleFilterDto.dateTo) {
      queryBuilder.andWhere('article.createdAt <= :dateTo', {
        dateTo: new Date(articleFilterDto.dateTo),
      });
    }

    const articles = await queryBuilder.getMany();

    return articles;
  }

  async findOne(id: number) {
    const article = await this.articleRepo.findOneBy({ id });

    if (!article) {
      throw new NotFoundException('No such article');
    }

    return article;
  }

  async create(user: UserEntity, createArticleDto: CreateArticleDto) {
    const articleEntity = this.articleRepo.create({
      ...createArticleDto,
      user,
    });

    await this.articleRepo.save(articleEntity);

    return articleEntity;
  }

  async update(
    user: UserEntity,
    id: number,
    updateArticleDto: UpdateArticleDto,
  ) {
    const article = await this.findOne(id);

    if (article.user.id !== user.id) {
      throw new ForbiddenException('You can update only your articles');
    }

    await this.articleRepo.update({ id }, updateArticleDto);

    return await this.findOne(id);
  }

  async remove(user: UserEntity, id: number) {
    const article = await this.findOne(id);

    if (article.user.id !== user.id) {
      throw new ForbiddenException('You can update only your articles');
    }

    await this.articleRepo.delete({ id });

    return article;
  }
}
