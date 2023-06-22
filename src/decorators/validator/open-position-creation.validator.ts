import {
    ValidationOptions,
    registerDecorator,
    ValidationArguments,
    ValidatorConstraintInterface,
    ValidatorConstraint,
    validateSync,
} from 'class-validator';
import { CreateOpenPositionDto } from 'src/modules/project/dtos/create-open-position.dto';

export function IsOpenPositionCreation(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isOpenPositionCreation',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsOpenPositionCreationValidator,
        });
    };
}

@ValidatorConstraint({ name: 'IsOpenPositionCreation' })
class IsOpenPositionCreationValidator implements ValidatorConstraintInterface {
    validate(openPositions: Array<CreateOpenPositionDto>): boolean {
        return (
            Array.isArray(openPositions) &&
            openPositions.every((openPosition, index) => {
                openPositions[index] = openPosition = Object.assign(
                    new CreateOpenPositionDto(),
                    openPosition,
                );
                return !validateSync(openPosition).length;
            })
        );
    }

    defaultMessage?(validationArguments?: ValidationArguments): string {
        return `${validationArguments.property} was expected to be array of open positions, found ${validationArguments.value} instead`;
    }
}
