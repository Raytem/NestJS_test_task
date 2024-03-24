import { Injectable } from '@nestjs/common';
import { TypeOrmPagination } from './types/type-orm-pagination';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class PaginationService {
  paginate(
    paginationDto: PaginationDto,
    defaultPerPage = 20,
  ): TypeOrmPagination {
    const page = paginationDto.page || 1;
    const perPage = paginationDto.perPage || defaultPerPage;

    const skip = (page - 1) * perPage;

    return {
      skip,
      take: perPage,
    };
  }
}
