import { IsString, MinLength, IsDefined, IsEnum } from 'class-validator';
import { AssetType } from '../enums/asset-type.enum';

export class AssetDto {
    @IsString({ message: 'not_string' })
    @MinLength(1, { message: 'too_short' })
    @IsDefined({ message: 'not_defined' })
    title: string;

    @IsString({ message: 'not_string' })
    @MinLength(1, { message: 'too_short' })
    @IsDefined({ message: 'not_defined' })
    url: string;

    @IsEnum(AssetType, { message: 'not_asset_type' })
    @IsDefined({ message: 'not_defined' })
    type: AssetType;
}
