import {
    ValidationOptions,
    registerDecorator,
    ValidationArguments,
    ValidatorConstraintInterface,
    ValidatorConstraint,
    validateSync,
} from 'class-validator';
import { AssetDto } from '../../modules/asset/dtos/asset.dto';

export function IsAssetUpload(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isAssetUpload',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsAssetUploadValidator,
        });
    };
}

@ValidatorConstraint({ name: 'IsAssetUpload' })
class IsAssetUploadValidator implements ValidatorConstraintInterface {
    validate(assets: Array<AssetDto | number>): boolean {
        return (
            Array.isArray(assets) &&
            assets.every((asset, index) => {
                if (typeof asset === 'number') {
                    return true;
                } else {
                    assets[index] = asset = Object.assign(
                        new AssetDto(),
                        asset,
                    );
                    return !validateSync(asset).length;
                }
            })
        );
    }

    defaultMessage?(validationArguments?: ValidationArguments): string {
        return `${validationArguments.property} was expected to be array of assets, found ${validationArguments.value} instead`;
    }
}
