import { BadRequestException, ValidationError } from '@nestjs/common';

export const throwValidationException = (err: ValidationError[]) => {
    throw new BadRequestException(
        err.map((v) => {
            const constraints: {
                [key: string]: { message: string; additionalData: any };
            } = {};
            if (v && v.constraints) {
                Object.keys(v.constraints).forEach((key) => {
                    constraints[key] = {
                        message:
                            key !== 'whitelistValidation'
                                ? v.constraints[key]
                                : 'additional_properties_not_allowed',
                        additionalData: v.contexts
                            ? v.contexts[key]
                            : undefined,
                    };
                });
            } else {
                console.error(`Constraints not an object for ${v.property}:`);
                console.error(v.constraints);
            }
            return { property: v.property, constraints };
        }),
    );
};
