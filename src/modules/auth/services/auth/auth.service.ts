import { Injectable } from '@nestjs/common';
import { IAuthService } from 'src/interfaces/auth.service.interface';
import { User } from 'src/modules/user/entities/user.entity';
import { IssuedRefreshToken } from '../../entities/issued-refresh-token.entity';
import { IAuthTokenService } from 'src/interfaces/auth-token.service.interface';
import { IPasswordService } from 'src/interfaces/password.service.interface';

@Injectable()
export class AuthService implements IAuthService {
    /**
     * Prepares AuthService object.
     *
     * @param authTokenService injected AuthTokenService object
     * @param passwordService injected PasswordService object
     */
    constructor(
        private readonly authTokenService: IAuthTokenService,
        private readonly passwordService: IPasswordService,
    ) {}

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

    async requestPasswordReset(emailAddress: string): Promise<string> {
        return await this.passwordService.requestPasswordReset(emailAddress);
    }
    async resetPassword(
        emailAddress: string,
        oneTimeToken: string,
        newPassword: string,
    ): Promise<void> {
        return await this.passwordService.resetPassword(
            emailAddress,
            oneTimeToken,
            newPassword,
        );
    }
    async changePassword(userId: number, newPassword: string): Promise<void> {
        await this.passwordService.changePassword(userId, newPassword);
    }
}
