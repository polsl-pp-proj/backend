import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import { AuthTokensDto } from 'src/modules/auth/dtos/auth-tokens.dto';
import { RefreshTokenPayloadDto } from 'src/modules/auth/dtos/refresh-token-payload.dto';
import { IssuedRefreshToken } from 'src/modules/auth/entities/issued-refresh-token.entity';
import { User } from 'src/modules/user/entities/user.entity';

export abstract class IAuthTokenService {
    /**
     * Generates auth and refresh token for given User.
     *
     * @param user User to generate token pair for
     * @returns AuthTokensDto containing auth and refresh token
     */
    abstract generateTokenPair(user: User): Promise<AuthTokensDto>;

    /**
     * Creates auth and refresh token pair without removing old refresh token.
     *
     * @param user User to create token pair for
     * @param remoteIp IP address of client sending request
     * @returns AuthTokensDto containing new auth and refresh token
     */
    abstract createTokenPairForLogin(user: User, remoteIp: string);
    /**
     * Creates auth and refresh token pair and removes old refresh token.
     *
     * @param issuedRefreshToken IssuedRefreshToken to regenerate
     * @param remoteIp IP address of client sending request
     * @returns AuthTokensDto containing regenerated auth and refresh token
     */
    abstract createTokenPairForRefresh(
        issuedRefreshToken: IssuedRefreshToken,
        remoteIp: string,
    );

    /**
     * Invalidates auth and refresh token.
     *
     * @param issuedRefreshToken refresh token to invalidate
     */
    abstract invalidateTokenPair(issuedRefreshToken: IssuedRefreshToken);

    /**
     * Invalidates all auth and refresh tokens for user.
     *
     * @param userId ID of user to invalidate tokens for
     */
    abstract invalidateAllTokensForUser(userId: number);

    /**
     * Fetches issued refresh token with associated user.
     *
     * @param refreshTokenPayload payload of refresh token to get
     */
    abstract getIssuedRefreshTokenWithUser(
        refreshTokenPayload: RefreshTokenPayloadDto,
    ): Promise<IssuedRefreshToken>;

    /**
     * Creates AuthTokenPayloadDto and fills it with data from User object.
     *
     * @param user User object to fill AuthTokenPayloadDto with
     * @returns DTO of AuthToken's payload
     */
    abstract userToAuthTokenPayload(user: User): AuthTokenPayloadDto;

    /**
     * Creates User and fills it with data from AuthTokenPayloadDto object.
     *
     * @param authTokenPayload AuthTokenPayloadDto object to fill User with
     * @returns User object
     */
    abstract authTokenPayloadToUser(
        authTokenPayload: AuthTokenPayloadDto,
    ): User;
}
