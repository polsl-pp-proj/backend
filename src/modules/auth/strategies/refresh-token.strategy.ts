import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { jwtStrategyConfig } from '../configs/jwt-strategy.config';
import { plainToInstance } from 'class-transformer';
import { RefreshTokenPayloadDto } from '../dtos/refresh-token-payload.dto';
import { IAuthTokenService } from 'src/interfaces/auth-token.service.interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'refresh-token',
) {
    constructor(private readonly authTokenService: IAuthTokenService) {
        super(jwtStrategyConfig);
    }

    async validate(payload: RefreshTokenPayloadDto) {
        payload = plainToInstance(RefreshTokenPayloadDto, payload);
        const issuedRefreshToken =
            await this.authTokenService.getIssuedRefreshTokenWithUser(payload);
        if (!issuedRefreshToken) {
            throw new UnauthorizedException();
        }
        return issuedRefreshToken;
    }
}
