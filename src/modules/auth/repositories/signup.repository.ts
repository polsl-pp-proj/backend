import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { UserRole } from 'src/modules/user/enums/user-role.enum';
import { DataSource, MoreThan } from 'typeorm';
import { SignupDto } from '../dtos/signup.dto';
import { CredentialType } from '../enums/credential-type.enum';
import { OneTimeTokenType } from '../enums/one-time-token-type.enum';
import { CredentialRepository } from './credential.repository';
import { checkUniqueViolation } from 'src/helpers/check-unique-violation.helper';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { oneTimeTokenConfig } from '../configs/one-time-token.config';
import { OneTimeTokenRepository } from './one-time-token.repository';

@Injectable()
export class SignupRepository {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

    /**
     * @returns UUID of one time token generated for account activation
     */
    async signup(signupDto: SignupDto, hashedPassword: string) {
        return await this.dataSource.transaction(async (entityManager) => {
            let user: User;

            const userRepository = new UserRepository(
                this.dataSource,
                entityManager,
            );
            const credentialRepository = new CredentialRepository(
                this.dataSource,
                entityManager,
            );
            const oneTimeTokenRepository = new OneTimeTokenRepository(
                this.dataSource,
                entityManager,
            );

            try {
                user = await userRepository.insertUser({
                    emailAddress: signupDto.emailAddress,
                    firstName: signupDto.firstName,
                    lastName: signupDto.lastName,
                    role: UserRole.BasicUser,
                });
            } catch (ex) {
                checkUniqueViolation(ex, 'user_with_email_address_exists');
                throw ex;
            }

            try {
                await credentialRepository.insertCredential({
                    userId: user.id,
                    type: CredentialType.Password,
                    credential: hashedPassword,
                });
                return await oneTimeTokenRepository.generateOneTimeToken(
                    user.emailAddress,
                    OneTimeTokenType.Signup,
                    oneTimeTokenConfig.getExpiryDate(),
                );
            } catch (ex) {
                checkUniqueViolation(
                    ex,
                    'user_already_has_credential_type_provided',
                );
                throw ex;
            }
        });
    }

    async confirmSingup(emailAddress: string, oneTimeToken: string) {
        return await this.dataSource.manager.transaction(async (manager) => {
            const userRepository = new UserRepository(
                manager.connection,
                manager,
            );
            const oneTimeTokenRepository = new OneTimeTokenRepository(
                manager.connection,
                manager,
            );

            const tokenEntry = await oneTimeTokenRepository.findOne({
                where: {
                    uuid: oneTimeToken,
                    user: { emailAddress },
                    isActive: true,
                    expiry: MoreThan(new Date()),
                    type: OneTimeTokenType.Signup,
                },
                relations: { user: true },
            });
            if (tokenEntry) {
                await userRepository.save({
                    id: tokenEntry.userId,
                    isActive: true,
                });
                await oneTimeTokenRepository.save({
                    id: tokenEntry.id,
                    isActive: false,
                });
                return tokenEntry.user;
            }
            throw new NotFoundException(
                'invalid_token_or_email_address_provided',
            );
        });
    }
}
