import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { MockType } from 'test/types/mock-type.type';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '../../../test/factories/repository-mock.factory';

describe('UserService', () => {
  let userService: UserService;
  let userRepo: MockType<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepo = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepo).toBeDefined();
  });

  
});
