import {
    ArrayNotEmpty,
    IsArray,
    IsDefined,
    IsNumber,
    IsString,
    MaxLength,
    MinLength,
    ValidateNested,
} from 'class-validator';
import { CreateOpenPositionDto } from './create-open-position.dto';
import { Transform, Type } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { IsOpenPositionCreation } from 'src/decorators/validator/open-position-creation.validator';

export class CreateProjectDto {
    @IsDefined({ message: 'not_defined' })
    @IsString({ message: 'not_a_string' })
    @MinLength(2, { message: 'too_short' })
    @MaxLength(60, { message: 'too_long' })
    name: string;

    @IsDefined({ message: 'not_defined' })
    @IsString({ message: 'not_a_string' })
    @MinLength(2, { message: 'too_short' })
    @MaxLength(150, { message: 'too_long' })
    shortDescription: string;

    @IsDefined({ message: 'not_defined' })
    @IsString({ message: 'not_a_string' })
    @MinLength(2, { message: 'too_short' })
    description: string;

    @IsString({ message: 'not_a_string' })
    fundingObjectives?: string;

    @Transform((params) => {
        try {
            return JSON.parse(params.value);
        } catch (e) {
            throw new BadRequestException(
                `${params.key} contains invalid JSON `,
            );
        }
    })
    @IsOpenPositionCreation({ message: 'not_open_position_array' })
    @IsArray({ message: 'not_an_array' })
    openPositions: CreateOpenPositionDto[];

    @Transform((params) => {
        try {
            return JSON.parse(params.value);
        } catch (e) {
            throw new BadRequestException(
                `${params.key} contains invalid JSON `,
            );
        }
    })
    @IsDefined({ message: 'not_defined' })
    @IsArray({ message: 'not_an_array' })
    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
        { each: true, message: 'not_a_number' },
    )
    categories: number[];

    @Transform((params) => {
        try {
            return JSON.parse(params.value);
        } catch (e) {
            throw new BadRequestException(
                `${params.key} contains invalid JSON `,
            );
        }
    })
    @ArrayNotEmpty({ message: 'array_empty' })
    @IsArray({
        message: 'not_array',
    })
    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
        { each: true, message: 'not_a_number' },
    )
    assets: number[];
}
