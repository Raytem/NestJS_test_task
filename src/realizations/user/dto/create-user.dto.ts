import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';
import { IsString } from 'class-validator';

export class CreateUserDto extends OmitType(UserEntity, [
  'id',
  'articles',
  'password',
]) {
  @ApiProperty({ type: String, minLength: 4, maxLength: 32 })
  @IsString()
  password: string;
}
