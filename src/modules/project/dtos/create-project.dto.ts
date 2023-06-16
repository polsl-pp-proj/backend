import {
    IsArray,
    IsDefined,
    IsJSON,
    IsNumber,
    IsPositive,
    IsString,
    MaxLength,
    MinLength,
    ValidateNested,
} from 'class-validator';
import { CreateOpenPositionDto } from './create-open-position.dto';
import { Transform, Type } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

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
    @MinLength(2, { message: 'too_short' })
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
    @IsDefined({ message: 'not_defined' })
    @IsArray({ message: 'not_an_array' })
    @ValidateNested()
    @Type(() => CreateOpenPositionDto)
    openPositions: CreateOpenPositionDto[];
}
