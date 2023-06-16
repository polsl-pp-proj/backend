import {
    ValidationOptions,
    registerDecorator,
    ValidationArguments,
    ValidatorConstraintInterface,
    ValidatorConstraint,
    validateSync,
} from 'class-validator';
import { CreateOpenPositionDto } from 'src/modules/project/dtos/create-open-position.dto';

export function IsOpenPositionUpload(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isOpenPositionUpload',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsOpenPositionUploadValidator,
        });
    };
}

@ValidatorConstraint({ name: 'IsOpenPositionUpload' })
class IsOpenPositionUploadValidator implements ValidatorConstraintInterface {
    validate(openPositions: Array<CreateOpenPositionDto | number>): boolean {
        return (
            Array.isArray(openPositions) &&
            openPositions.every((openPosition, index) => {
                if (typeof openPosition === 'number') {
                    return true;
                } else {
                    openPositions[index] = openPosition = Object.assign(
                        new CreateOpenPositionDto(),
                        openPosition,
                    );
                    return !validateSync(openPosition).length;
                }
            })
        );
    }

    defaultMessage?(validationArguments?: ValidationArguments): string {
        return `${validationArguments.property} was expected to be array of open positions, found ${validationArguments.value} instead`;
    }
}
