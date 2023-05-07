import { BadRequestException, ValidationError } from '@nestjs/common';

export const throwValidationException = (err: ValidationError[]) => {
    throw new BadRequestException(
        err.map((v) => {
            const constraints: {
                [key: string]: { message: string; additionalData: any };
            } = {};
            Object.keys(v.constraints).forEach((key) => {
                constraints[key] = {
                    message:
                        key !== 'whitelistValidation'
                            ? v.constraints[key]
                            : 'additional_properties_not_allowed',
                    additionalData: v.contexts ? v.contexts[key] : undefined,
                };
            });
            return { property: v.property, constraints };
        }),
    );
};
