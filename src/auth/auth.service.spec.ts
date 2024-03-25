import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../src/realizations/user/user.service';
import { JwtService } from './jwt/jwt.service';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  const mockUserService = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        ConfigService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
  });
});
