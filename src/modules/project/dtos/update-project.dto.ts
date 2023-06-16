import { Transform } from 'class-transformer';
import {
    IsDefined,
    IsString,
    MinLength,
    MaxLength,
    IsArray,
    ArrayNotEmpty,
} from 'class-validator';
import { CreateOpenPositionDto } from './create-open-position.dto';
import { IsOpenPositionUpload } from 'src/decorators/validator/open-position-upload.validator';
import { BadRequestException } from '@nestjs/common';
import { AssetDto } from 'src/modules/asset/dtos/asset.dto';
import { IsAssetUpload } from 'src/decorators/validator/is-asset-upload.validator';

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

    @Transform((params) => {
        try {
            return JSON.parse(params.value);
        } catch (e) {
            throw new BadRequestException(
                `${params.key} contains invalid JSON `,
            );
        }
    })
    @IsAssetUpload({ message: 'not_asset_array' })
    @ArrayNotEmpty({ message: 'array_empty' })
    @IsArray({
        message: 'not_array',
    })
    assets: (AssetDto | number)[];
}
