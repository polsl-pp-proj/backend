import { User } from '../modules/user/entities/user.entity';

export abstract class IPasswordService {
    /**
     * Verfies password for user with given emailAddress.
     *
     * @param emailAddress User's email address
     * @param password password to verify with User's password
     */
    abstract validateAndGetUser(
        emailAddress: string,
        password: string,
    ): Promise<User | null>;

    /**
     * Sets new password for user with given id.
     *
     * @param userId User's id
     * @param newPassword password to set
     */
    abstract changePassword(userId: number, newPassword: string): Promise<void>;

    /**
     * Sets new password for authorized user.
     *
     * @param emailAddress user's email address
     * @param oneTimeToken one time token issued for password reset
     * @param newPassword password to set
     */
    abstract resetPassword(
        emailAddress: string,
        oneTimeToken: string,
        newPassword: string,
    );

    /**
     * Hashes password for database storage.
     *
     * Uses *Argon2* algorithm.
     *
     * @param password password to hash
     */
    abstract createPasswordHash(password: string): Promise<string>;
}
