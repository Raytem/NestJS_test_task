import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, Min } from 'class-validator';
import { PaginationDto } from '../../../pagination/dto/pagination.dto';

export class ArticleFilterDto extends PaginationDto {
  @ApiProperty({ type: Number, minimum: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  userId?: number;

  @ApiProperty({ type: Date, required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateFrom?: Date;

  @ApiProperty({ type: Date, required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateTo?: Date;
}
