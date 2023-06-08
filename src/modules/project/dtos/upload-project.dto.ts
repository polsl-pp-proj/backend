import {
    IsArray,
    IsDefined,
    IsJSON,
    IsNumber,
    IsString,
    MaxLength,
    MinLength,
    ValidateNested,
} from 'class-validator';
import { UploadOpenPositionDto } from './upload-open-position.dto';
import { Type } from 'class-transformer';

export class UploadProjectDto {
    @IsDefined({ message: 'not_defined' })
    @IsString({ message: 'not_a_string' })
    @MinLength(2, { message: 'too_short' })
    @MaxLength(60, { message: 'too_long' })
    name: string;

    @IsDefined({ message: 'not_defined' })
    @IsNumber({ maxDecimalPlaces: 0 }, { message: 'not_a_number' })
    ownerOrganizationId: number;

    @IsDefined({ message: 'not_defined' })
    @IsString({ message: 'not_a_string' })
    @MinLength(2, { message: 'too_short' })
    @MaxLength(150, { message: 'too_long' })
    shortDescription: string;

    @IsDefined({ message: 'not_defined' })
    @IsString({ message: 'not_a_string' })
    @MinLength(2, { message: 'too_short' })
    description: string;

    @IsDefined({ message: 'not_defined' })
    @IsString({ message: 'not_a_string' })
    @MinLength(2, { message: 'too_short' })
    fundingObjectives: string;

    @IsDefined({ message: 'not_defined' })
    @IsArray({ message: 'not_an_array' })
    @ValidateNested()
    @Type(() => UploadOpenPositionDto)
    openPositions: UploadOpenPositionDto[];
}
