import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../realizations/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../decorators/is-public.decorator';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserWithTokenDto } from './dto/user-with-token.dto';

@ApiTags('auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, type: UserWithTokenDto })
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, type: UserWithTokenDto })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
