import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { MockType } from '../../../test/types/mock-type.type';
import { Repository } from 'typeorm';
import { ArticleEntity } from './entities/article.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '../../../test/factories/repository-mock.factory';
import { PaginationService } from '../../pagination/pagination.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UpdateArticleDto } from './dto/update-article.dto';

describe('ArticleService', () => {
  let articleService: ArticleService;
  let articleRepo: MockType<Repository<ArticleEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        PaginationService,
        {
          provide: getRepositoryToken(ArticleEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    articleService = module.get<ArticleService>(ArticleService);
    articleRepo = module.get(getRepositoryToken(ArticleEntity));
  });

  const userEntity = {
    id: 1,
    email: 'test@yandex.ru',
    name: 'test',
  } as UserEntity;

  it('should be defined', () => {
    expect(articleRepo).toBeDefined();
    expect(articleService).toBeDefined();
  });

  describe('create', () => {
    const createArticleDto: CreateArticleDto = {
      title: 'testTitle',
      description: 'test',
    };

    const articleEntity: ArticleEntity = {
      id: 1,
      title: 'testTitle',
      description: 'test',
      user: userEntity,
      createdAt: new Date(),
    };

    it('should create an article', async () => {
      articleRepo.create.mockResolvedValue(articleEntity);

      const res = await articleService.create(userEntity, createArticleDto);
      expect(res).toEqual(articleEntity);
    });
  });

  describe('update', () => {
    const updateArticleDto: UpdateArticleDto = {
      title: 'updatedTitle',
      description: 'updated',
    };

    const articleEntity: ArticleEntity = {
      id: 1,
      title: 'testTitle',
      description: 'test',
      user: userEntity,
      createdAt: new Date(),
    };

    it('should update article', async () => {
      jest.spyOn(articleService, 'findOne').mockResolvedValue({
        ...articleEntity,
        ...updateArticleDto,
      });

      const res = await articleService.update(userEntity, 1, updateArticleDto);

      expect(res).toEqual({
        ...articleEntity,
        ...updateArticleDto,
      });
    });

    it('should throw an error if no article with provided id', async () => {
      articleRepo.findOneBy.mockResolvedValue(null);

      expect(async () => {
        return await articleService.update(userEntity, 1, updateArticleDto);
      }).rejects.toThrow();
    });

    it('should throw an error if user don`t have a permission to update', async () => {
      jest.spyOn(articleService, 'findOne').mockResolvedValue(articleEntity);

      expect(async () => {
        return await articleService.update(
          { ...userEntity, id: 2 },
          1,
          updateArticleDto,
        );
      }).rejects.toThrow();
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
