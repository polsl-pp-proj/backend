import { Transform, Type } from 'class-transformer';
import {
    IsDefined,
    IsString,
    MinLength,
    MaxLength,
    IsArray,
    ValidateNested,
    ArrayNotEmpty,
} from 'class-validator';
import { CreateOpenPositionDto } from './create-open-position.dto';
import { IsOpenPositionUpload } from 'src/decorators/validator/open-position-upload.validator';
import { BadRequestException } from '@nestjs/common';

export class UpdateProjectDto {
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
    @IsOpenPositionUpload({ message: 'not_open_position_array' })
    @IsArray({
        message: 'not_array',
    })
    openPositions: (CreateOpenPositionDto | number)[];
}
