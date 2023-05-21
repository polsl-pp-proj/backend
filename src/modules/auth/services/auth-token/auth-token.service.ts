import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
    DecodedRefreshTokenPayloadDto,
    RefreshTokenPayloadDto,
} from '../../dtos/refresh-token-payload.dto';
import { AuthTokenPayloadDto } from '../../dtos/auth-token-payload.dto';
import { IAuthTokenService } from 'src/interfaces/auth-token.service.interface';
import { JwtService } from '@nestjs/jwt';
import { IssuedRefreshToken } from '../../entities/issued-refresh-token.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { AuthTokensDto } from '../../dtos/auth-tokens.dto';
import { MoreThanOrEqual } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import {
    jwtAuthTokenConfig,
    jwtRefreshTokenConfig,
} from '../../configs/jwt-sign.config';
import { IssuedRefreshTokenRepository } from '../../repositories/issued-refresh-token.repository';
import { UserOrganizationDto } from '../../dtos/user-organization.dto';
import { OrganizationUser } from 'src/modules/organization/entities/organization-user.entity';

const sixMonthsInMs = 13046400;

@Injectable()
export class AuthTokenService implements IAuthTokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly issuedRefreshTokenRepository: IssuedRefreshTokenRepository,
    ) {}

    async generateTokenPair(user: User): Promise<AuthTokensDto> {
        const authTokenPayload = this.generateAuthTokenPayload(user);
        const refreshTokenPayload = this.generateRefreshTokenPayload(
            authTokenPayload.userId,
            authTokenPayload.uuid,
        );

        const authToken = await this.signAuthToken(authTokenPayload);
        const refreshToken = await this.signRefreshToken(refreshTokenPayload);

        return new AuthTokensDto({ authToken, refreshToken });
    }

    async createTokenPairForLogin(user: User, remoteIp: string) {
        const { decodedRefreshToken, tokenPair } =
            await this.generateAndDecodeTokenPair(user);

        await this.issuedRefreshTokenRepository.insertIssuedRefreshToken({
            decodedRefreshToken,
            remoteIp,
        });

        return tokenPair;
    }

    async createTokenPairForRefresh(
        issuedRefreshToken: IssuedRefreshToken,
        remoteIp: string,
    ) {
        const { decodedRefreshToken, tokenPair } =
            await this.generateAndDecodeTokenPair(issuedRefreshToken.user);

        await this.issuedRefreshTokenRepository.insertIssuedRefreshTokenWithOldDelete(
            {
                decodedRefreshToken,
                remoteIp,
                oldRefreshTokenId: issuedRefreshToken.id,
            },
        );

        return tokenPair;
    }

    async invalidateTokenPair(issuedRefreshToken: IssuedRefreshToken) {
        await this.issuedRefreshTokenRepository.manager.transaction(
            async (entityManager) => {
                const issuedRefreshTokenRepository =
                    new IssuedRefreshTokenRepository(
                        entityManager.connection,
                        entityManager,
                    );

                await issuedRefreshTokenRepository.deleteIssuedRefreshToken(
                    issuedRefreshToken.id,
                );
                await this.invalidateAuthTokenForUser(
                    issuedRefreshToken.userId,
                    issuedRefreshToken.forAuthTokenUuid,
                );
            },
        );
    }

    async invalidateAllTokensForUser(userId: number) {
        await this.issuedRefreshTokenRepository.manager.transaction(
            async (entityManager) => {
                const issuedRefreshTokenRepository =
                    new IssuedRefreshTokenRepository(
                        entityManager.connection,
                        entityManager,
                    );

                const authTokenUuids =
                    await issuedRefreshTokenRepository.deleteAllIssuedRefreshTokensForUser(
                        userId,
                    );
                await Promise.all(
                    authTokenUuids.map(
                        async (token) =>
                            await this.invalidateAuthTokenForUser(
                                userId,
                                token,
                            ),
                    ),
                );
            },
        );
    }

    async getIssuedRefreshTokenWithUser(
        refreshTokenPayload: RefreshTokenPayloadDto,
    ): Promise<IssuedRefreshToken> {
        const issuedRefreshToken =
            await this.issuedRefreshTokenRepository.findOne({
                where: {
                    userId: refreshTokenPayload.userId,
                    uuid: refreshTokenPayload.uuid,
                    expiry: MoreThanOrEqual(new Date()),
                },
                relations: {
                    user: { userOrganizations: true },
                },
            });
        return issuedRefreshToken;
    }

    userToAuthTokenPayload(user: User): AuthTokenPayloadDto {
        return new AuthTokenPayloadDto({
            userId: user.id,
            emailAddress: user.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive,
            isVerifiedStudent: user.lastVerifiedAsStudent
                ? user.lastVerifiedAsStudent.valueOf() + sixMonthsInMs >
                  new Date().valueOf()
                : false,
            lastVerifiedAsStudent: user.lastVerifiedAsStudent
                ? user.lastVerifiedAsStudent.valueOf()
                : null,
            role: user.role,
            organizations:
                user.userOrganizations?.map(
                    (userOrganization) =>
                        new UserOrganizationDto({
                            organizationId: userOrganization.organizationId,
                            role: userOrganization.role,
                        }),
                ) ?? [],
        });
    }

    authTokenPayloadToUser(authTokenPayload: AuthTokenPayloadDto): User {
        return plainToInstance(User, {
            id: authTokenPayload.userId,
            emailAddress: authTokenPayload.emailAddress,
            firstName: authTokenPayload.firstName,
            lastName: authTokenPayload.lastName,
            isActive: authTokenPayload.isActive,
            lastVerifiedAsStudent: authTokenPayload.lastVerifiedAsStudent,
            role: authTokenPayload.role,
            userOrganizations: authTokenPayload.organizations.map(
                (userOrganization) =>
                    Object.assign(new OrganizationUser(), {
                        organization: { id: userOrganization.organizationId },
                        organizationId: userOrganization.organizationId,
                        role: userOrganization.role,
                        user: { id: authTokenPayload.userId },
                        userId: authTokenPayload.userId,
                    }),
            ),
        });
    }

    private async invalidateAuthTokenForUser(
        userId: number,
        authToken: string,
    ) {
        // TODO: Implement redis-based auth token invalidation
    }

    /**
     * Generates payload for Auth Token.
     *
     * @param user User to generate auth token for
     */
    private generateAuthTokenPayload(user: User): AuthTokenPayloadDto {
        const authTokenPayload = this.userToAuthTokenPayload(user);
        authTokenPayload.uuid = randomUUID();
        return authTokenPayload;
    }

    /**
     * Generates payload for Refresh Token.
     *
     * @param userId id of User to generate refresh token for
     * @param forAuthTokenUuid uuid of auth token to generate refresh token for
     */
    private generateRefreshTokenPayload(
        userId: number,
        forAuthTokenUuid: string,
    ): RefreshTokenPayloadDto {
        return new RefreshTokenPayloadDto({
            userId: userId,
            forUuid: forAuthTokenUuid,
            uuid: randomUUID(),
        });
    }

    /**
     * Generates token pair and decodes refresh token for additional operations.
     *
     * @param user User to generate token pair for
     * @returns DecodedRefreshTokenPayloadDto containing decoded refresh token payload
     *          and AuthTokensDto containing auth and refresh token
     */
    private async generateAndDecodeTokenPair(user: User) {
        const tokenPair = await this.generateTokenPair(user);

        const decodedRefreshToken = this.jwtService.decode(
            tokenPair.refreshToken,
        ) as DecodedRefreshTokenPayloadDto;
        return { decodedRefreshToken, tokenPair };
    }

    /**
     * Creates JWT with AuthTokenPayloadDto as payload.
     *
     * @param authTokenPayload payload to use in JWT
     * @returns signed AuthToken with authTokenPayload as payload
     */
    private async signAuthToken(authTokenPayload: AuthTokenPayloadDto) {
        return await this.jwtService.signAsync(
            {
                ...authTokenPayload,
            },
            jwtAuthTokenConfig,
        );
    }

    /**
     * Creates JWT with RefreshTokenPayloadDto as payload.
     *
     * @param refreshTokenPayload payload to use in JWT
     * @returns signed RefreshToken with refreshTokenPayload as payload
     */
    private async signRefreshToken(
        refreshTokenPayload: RefreshTokenPayloadDto,
    ) {
        return await this.jwtService.signAsync(
            {
                ...refreshTokenPayload,
            },
            jwtRefreshTokenConfig,
        );
    }
}
