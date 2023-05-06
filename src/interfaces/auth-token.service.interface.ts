import { RefreshTokenPayloadDto } from 'src/modules/auth/dtos/refresh-token-payload.dto';
import { IssuedRefreshToken } from 'src/modules/auth/entities/issued-refresh-token.entity';

export abstract class IAuthTokenService {
    abstract getIssuedRefreshTokenWithUser(
        token: RefreshTokenPayloadDto,
    ): Promise<IssuedRefreshToken>;
}
