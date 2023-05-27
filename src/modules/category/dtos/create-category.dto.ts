import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
    @IsString({ message: 'not_string' })
    @MinLength(3, { message: 'name_too_short' })
    @MaxLength(50, { message: 'name_too_long' })
    name: string;
}
