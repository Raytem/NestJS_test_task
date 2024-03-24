import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractEntity {
  @ApiProperty({ type: Number, minimum: 1 })
  @PrimaryGeneratedColumn()
  id: number;
}
