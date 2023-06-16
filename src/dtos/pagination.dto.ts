import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class PaginationDto {
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
    @IsPositive()
    @Type(() => Number)
    page = 1;

    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
    @IsPositive()
    @Type(() => Number)
    elementsPerPage = 5;
}
