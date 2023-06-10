// PostgreSQL error codes are strings
export enum DatabaseError {
    ForeignKeyConstraintViolation = '23503',
    UniqueConstraintViolation = '23505',
}
