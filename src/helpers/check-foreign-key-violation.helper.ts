import { ForeignKeyConstraintViolationException } from 'src/exceptions/foreign-key-constraint-violation.exception';
import { DatabaseError } from '../enums/database-error.enum';
import { queryFailed } from './query-failed.helper';

export const checkForeignKeyViolation = (ex: Error, message?: string) => {
    if (
        queryFailed(ex) &&
        ex.code == DatabaseError.ForeignKeyConstraintViolation
    ) {
        throw new ForeignKeyConstraintViolationException(message);
    }
};
