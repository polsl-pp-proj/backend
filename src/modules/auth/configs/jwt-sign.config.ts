import { JwtSignOptions } from '@nestjs/jwt';

export const jwtAuthTokenConfig: JwtSignOptions = {
    expiresIn: '5 minutes',
};

export const jwtRefreshTokenConfig: JwtSignOptions = {
    expiresIn: '1 year',
};
