import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class PaginationDto {
    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
        { message: 'not_a_number' },
    )
    @IsPositive({ message: 'not_positive_number' })
    @Type(() => Number)
    page = 1;

    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
        { message: 'not_a_number' },
    )
    @IsPositive({ message: 'not_positive_number' })
    @Type(() => Number)
    elementsPerPage = 5;
}
