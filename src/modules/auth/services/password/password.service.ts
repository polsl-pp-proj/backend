import { Injectable } from '@nestjs/common';
import { IPasswordService } from 'src/interfaces/password.service.interface';
import { User } from 'src/modules/user/entities/user.entity';
import { CredentialType } from '../../enums/credential-type.enum';
import { argon2Options } from '../../configs/argon2.config';
import * as argon2 from 'argon2';
import { CredentialRepository } from '../../repositories/credential.repository';

@Injectable()
export class PasswordService implements IPasswordService {
    constructor(private readonly credentialRepository: CredentialRepository) {}

    async validateAndGetUser(
        emailAddress: string,
        password: string,
    ): Promise<User | null> {
        const credential = await this.credentialRepository.findOne({
            where: {
                user: { emailAddress: emailAddress },
                type: CredentialType.Password,
            },
            relations: { user: true },
        });

        if (
            credential &&
            (await this.verifyPassword(password, credential.credential))
        ) {
            return credential.user;
        }
        return null;
    }

    changePassword(userId: number, newPassword: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    resetPassword(
        emailAddress: string,
        oneTimeToken: string,
        newPassword: string,
    ) {
        throw new Error('Method not implemented.');
    }

    async createPasswordHash(password: string) {
        return await argon2.hash(password, { ...argon2Options, raw: false });
    }

    /**
     * Verifies whether entered password matches with password hash.
     *
     * @param password User-entered password
     * @param passwordHash password hash to match against
     * @returns true if passwords match, false otherwise
     */
    private async verifyPassword(
        password: string,
        passwordHash: string,
    ): Promise<boolean> {
        return await argon2.verify(passwordHash, password, argon2Options);
    }
}
