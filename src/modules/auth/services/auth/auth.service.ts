import { Injectable } from '@nestjs/common';
import { IAuthService } from 'src/interfaces/auth.service.interface';
import { User } from 'src/modules/user/entities/user.entity';
import { IssuedRefreshToken } from '../../entities/issued-refresh-token.entity';
import { IAuthTokenService } from 'src/interfaces/auth-token.service.interface';

@Injectable()
export class AuthService implements IAuthService {
    /**
     * Prepares AuthService object.
     *
     * @param authTokenService injected AuthTokenService object
     */
    constructor(private readonly authTokenService: IAuthTokenService) {}

    async login(user: User, clientIP: string) {
        return await this.authTokenService.createTokenPairForLogin(
            user,
            clientIP,
        );
    }

    async refreshTokens(
        issuedRefreshToken: IssuedRefreshToken,
        clientIP: string,
    ) {
        return await this.authTokenService.createTokenPairForRefresh(
            issuedRefreshToken,
            clientIP,
        );
    }

    async logout(issuedRefreshToken: IssuedRefreshToken) {
        await this.authTokenService.invalidateTokenPair(issuedRefreshToken);
    }

    async logoutFromAllDevices(userId: number) {
        await this.authTokenService.invalidateAllTokensForUser(userId);
    }

    requestPasswordReset(emailAddress: string): Promise<string> {
        throw new Error('Method not implemented.');
    }
    resetPassword(
        emailAddress: string,
        oneTimeToken: string,
        newPassword: string,
    ): Promise<void> {
        throw new Error('Method not implemented.');
    }
    changePassword(userId: number, newPassword: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
