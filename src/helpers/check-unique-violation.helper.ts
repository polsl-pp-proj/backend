import { DatabaseError } from '../enums/database-error.enum';
import { UniqueConstraintViolationException } from '../exceptions/unique-constraint-violation.exception';
import { queryFailed } from './query-failed.helper';

export const checkUniqueViolation = (ex: Error, message?: string) => {
    if (queryFailed(ex) && ex.code == DatabaseError.UniqueConstraintViolation) {
        throw new UniqueConstraintViolationException(message);
    }
};
