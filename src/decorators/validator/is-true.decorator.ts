import {
    ValidationOptions,
    registerDecorator,
    ValidationArguments,
    ValidatorConstraintInterface,
    ValidatorConstraint,
} from 'class-validator';

export function IsTrue(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isTrue',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsTrueValidator,
        });
    };
}

@ValidatorConstraint({ name: 'IsTrue' })
class IsTrueValidator implements ValidatorConstraintInterface {
    validate(value: any): boolean {
        return typeof value === 'boolean' && value;
    }

    defaultMessage?(validationArguments?: ValidationArguments): string {
        return `${validationArguments.property} was expected to be true, found ${validationArguments.value} instead`;
    }
}
