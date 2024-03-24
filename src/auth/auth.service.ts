import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/realizations/user/user.service';
import { CreateUserDto } from '../realizations/user/dto/create-user.dto';
import { JwtService } from './jwt/jwt.service';
import { UserWithTokenDto } from './dto/user-with-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validate(userId: number) {
    const user = await this.userService.findOne({ id: userId });
    return user;
  }

  async signup(createUserDto: CreateUserDto): Promise<UserWithTokenDto> {
    const password = await bcrypt.hash(createUserDto.password, 5);

    const user = await this.userService.create({
      ...createUserDto,
      password,
    });

    const accessToken = this.jwtService.generateAccessToken(user.id);

    return {
      user,
      accessToken,
    };
  }

  async login(loginDto: LoginDto): Promise<UserWithTokenDto> {
    const user = await this.userService.findOne({ email: loginDto.email });
    const passwordIsCorrect = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordIsCorrect) {
      throw new BadRequestException('invalid password');
    }

    const accessToken = this.jwtService.generateAccessToken(user.id);

    return {
      user,
      accessToken,
    };
  }
}
