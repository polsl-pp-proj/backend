import { QueryFailedError } from 'typeorm';
import { DatabaseError } from 'pg-protocol';

export const queryFailed = (
    err: any,
): err is QueryFailedError & DatabaseError => err instanceof QueryFailedError;
