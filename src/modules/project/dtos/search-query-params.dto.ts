import { Transform } from 'class-transformer';
import { IsOptional, IsEnum, IsString, IsNumber } from 'class-validator';
import { SearchSortBy } from '../enums/search-sort-by.enum';
import { PaginationDto } from 'src/dtos/pagination.dto';

export class SearchQueryParamsDto extends PaginationDto {
    @IsOptional()
    @IsEnum(SearchSortBy, { message: 'not_search_sort_by' })
    sort?: SearchSortBy;

    @IsOptional()
    @IsString({ message: 'not_string' })
    query?: string;

    @IsOptional()
    @IsNumber({}, { message: 'not_number' })
    @Transform((transform) => {
        const asInt = parseInt(transform.value);
        if (isNaN(asInt)) {
            return undefined;
        }
        return asInt;
    })
    category?: number;
}
