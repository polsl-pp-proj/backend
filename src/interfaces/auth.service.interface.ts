import { IssuedRefreshToken } from 'src/modules/auth/entities/issued-refresh-token.entity';
import { User } from 'src/modules/user/entities/user.entity';

export abstract class IAuthService {
    /**
     * Fetches user with given email address and verifies password.
     *
     * @param user User object
     * @param clientIP client's remote IP address
     */
    abstract login(user: User, remoteIp: string): Promise<IssuedRefreshToken>;

    /**
     * Invalidates old and creates new refresh token.
     *
     * @param issuedRefreshToken current refresh token
     * @param clientIP client's remote IP address
     */
    abstract refreshTokens(
        issuedRefreshToken: IssuedRefreshToken,
        clientIP: string,
    );

    /**
     * Invalidates User's auth and refresh token.
     *
     * @param issuedRefreshToken current refresh token
     */
    abstract logout(issuedRefreshToken: IssuedRefreshToken);

    /**
     * Invalidates all User's auth and refresh tokens.
     *
     * @param userId User's id
     */
    abstract logoutFromAllDevices(userId: number);

    /**
     * Fetches user with given email address,
     * creates one-time token for password reset
     * and sends password reset email to user.
     *
     * @param emailAddress User's email address
     */
    abstract requestPasswordReset(emailAddress: string): Promise<string>;

    /**
     * Sets new password for User
     * with given email address
     * and one time token, if valid.
     *
     * @param emailAddress User's email address
     * @param oneTimeToken single use token generated for password reset
     * @param newPassword password to set
     */
    abstract resetPassword(
        emailAddress: string,
        oneTimeToken: string,
        newPassword: string,
    ): Promise<void>;

    /**
     * Sets new password for User.
     *
     * @param userId User's ID
     * @param newPassword password to set
     */
    abstract changePassword(userId: number, newPassword: string): Promise<void>;
}
