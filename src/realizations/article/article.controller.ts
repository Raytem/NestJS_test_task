import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Public } from 'src/decorators/is-public.decorator';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { ArticleFilterDto } from './dto/article-filter.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArticleEntity } from './entities/article.entity';
import { ArticleCacheService } from './article.cache-service';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,

    private articleCacheService: ArticleCacheService,
  ) {}

  @ApiResponse({ status: 200, type: ArticleEntity, isArray: true })
  @Public()
  @Get()
  async findAll(
    @Query() articleFilterDto: ArticleFilterDto,
    @Req() req: Request,
  ) {
    const cacheKey = req.originalUrl;

    const cachedArticles = await this.articleCacheService.getArticles(cacheKey);
    if (cachedArticles) {
      return cachedArticles;
    }

    const articles = await this.articleService.findAll(articleFilterDto);
    await this.articleCacheService.set(cacheKey, articles);

    return articles;
  }

  @ApiResponse({ status: 200, type: ArticleEntity })
  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const cacheKey = req.originalUrl;

    const cachedArticles = await this.articleCacheService.getArticles(cacheKey);
    if (cachedArticles && cachedArticles.length) {
      return cachedArticles[0];
    }

    const article = await this.articleService.findOne(id);

    await this.articleCacheService.set(cacheKey, [article]);
    return article;
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: ArticleEntity })
  @Post()
  async create(
    @User() user: UserEntity,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    const article = await this.articleService.create(user, createArticleDto);

    return article;
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: ArticleEntity })
  @Patch(':id')
  async update(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    const article = await this.articleService.update(
      user,
      id,
      updateArticleDto,
    );
    await this.articleCacheService.invalidate(article.id);

    return article;
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: ArticleEntity })
  @Delete(':id')
  async remove(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const article = await this.articleService.remove(user, id);
    await this.articleCacheService.invalidate(article.id);

    return article;
  }
}
