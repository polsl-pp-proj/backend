import { throwValidationException } from 'src/helpers/validation-bad-request-exception-factory.helper';

export const validationConfig = {
    exceptionFactory: throwValidationException,
    skipMissingProperties: false,
    skipNullProperties: false,
    skipUndefinedProperties: false,
    forbidUnknownValues: true,
    forbidNonWhitelisted: true,
    whitelist: true,
    transform: true,
};
