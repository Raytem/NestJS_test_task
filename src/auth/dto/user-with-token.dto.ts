import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../realizations/user/entities/user.entity';

export class UserWithTokenDto {
  @ApiProperty({ type: () => UserEntity })
  user: UserEntity;

  @ApiProperty({ type: String })
  accessToken: string;
}
