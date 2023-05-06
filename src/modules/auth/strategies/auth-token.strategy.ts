import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthTokenPayloadDto } from '../dtos/auth-token-payload.dto';
import { plainToInstance } from 'class-transformer';
import { jwtStrategyConfig } from '../configs/jwt-strategy.config';

@Injectable()
export class AuthTokenStrategy extends PassportStrategy(
    Strategy,
    'auth-token',
) {
    constructor() {
        super(jwtStrategyConfig);
    }

    async validate(payload: AuthTokenPayloadDto) {
        return plainToInstance(AuthTokenPayloadDto, payload);
    }
}
