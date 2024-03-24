import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { ArticleEntity } from './entities/article.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class ArticleCacheService {
  private static articlesTTL = 60 * 5;

  private static invalidatedArticlesIdsKey = 'invalidated:articles';

  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,

    @InjectRepository(ArticleEntity)
    private articleRepo: Repository<ArticleEntity>,
  ) {}

  async getArticles(key: string): Promise<ArticleEntity[] | null> {
    //get articles from the cache
    let articles: ArticleEntity[] = await this.cacheManager.get(key);
    if (!articles) {
      return null;
    }

    //array of articles ids that was updated or deleted
    const invalidatedArticlesIds: number[] = await this.cacheManager.get(
      ArticleCacheService.invalidatedArticlesIdsKey,
    );

    if (invalidatedArticlesIds && invalidatedArticlesIds.length) {
      const curInvalidIds = articles
        .filter((el) => invalidatedArticlesIds.includes(el.id))
        .map((el) => el.id);

      if (curInvalidIds.length) {
        //remove invalidated articles
        articles = articles.filter((el) => !curInvalidIds.includes(el.id));

        //get fresh version of articles that was invalidated
        const freshArticles = await this.articleRepo.findBy({
          id: In(curInvalidIds),
        });

        //add fresh articles instead of invalidated
        articles.push(...freshArticles);

        //set fresh articles to the cache
        await this.cacheManager.set(key, articles, {
          ttl: ArticleCacheService.articlesTTL,
        });
        //update list of invalidated articles
        await this.cacheManager.set(
          ArticleCacheService.invalidatedArticlesIdsKey,
          invalidatedArticlesIds.filter((el) => !curInvalidIds.includes(el)),
          { ttl: 0 },
        );
      }
    }

    return articles.map((article) => new ArticleEntity(article));
  }

  async invalidate(articleId: number): Promise<void> {
    const invalidatedArticlesIds: number[] =
      (await this.cacheManager.get(
        ArticleCacheService.invalidatedArticlesIdsKey,
      )) || [];

    await this.cacheManager.set(
      ArticleCacheService.invalidatedArticlesIdsKey,
      [...invalidatedArticlesIds, articleId],
      { ttl: 0 },
    );
  }

  async set(key: string, articles: ArticleEntity[]) {
    await this.cacheManager.set(key, articles, {
      ttl: ArticleCacheService.articlesTTL,
    });
  }
}
