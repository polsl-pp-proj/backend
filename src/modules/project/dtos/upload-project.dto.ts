import {
    IsDefined,
    IsNumber,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class UploadProjectDto {
    @IsString()
    @MinLength(2, { message: 'too_short' })
    @MaxLength(60, { message: 'too_long' })
    name: string;

    @IsDefined({ message: 'not_defined' })
    @IsNumber({ maxDecimalPlaces: 0 }, { message: 'not_a_number' })
    ownerOrganizationId: number;

    @IsString()
    @MinLength(2, { message: 'too_short' })
    @MaxLength(100, { message: 'too_long' })
    shortDescription: string;

    @IsString()
    @MinLength(2, { message: 'too_short' })
    description: string;

    @IsString()
    fundingObjectives: string;
}
