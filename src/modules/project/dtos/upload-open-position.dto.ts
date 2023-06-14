import {
    IsArray,
    IsDefined,
    IsNumber,
    IsPositive,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class UploadOpenPositionDto {
    @IsNumber({ maxDecimalPlaces: 0 }, { message: 'not_a_number' })
    @IsPositive({ message: 'not_positive_number' })
    id?: number;

    @IsDefined({ message: 'not_defined' })
    @IsString({ message: 'not_a_string' })
    @MinLength(2, { message: 'too_short' })
    @MaxLength(100, { message: 'too_long' })
    name: string;

    @IsDefined({ message: 'not_defined' })
    @IsString({ message: 'not_a_string' })
    @MinLength(2, { message: 'too_short' })
    @MaxLength(200, { message: 'too_long' })
    description: string;

    @IsDefined({ message: 'not_defined' })
    @IsArray({ message: 'not_an_array' })
    @IsString({ each: true })
    requirements: string[];
}
