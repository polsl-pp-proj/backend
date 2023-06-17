import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, MoreThan } from 'typeorm';
import { OneTimeTokenRepository } from './one-time-token.repository';
import { OneTimeTokenType } from '../enums/one-time-token-type.enum';
import { oneTimeTokenConfig } from '../configs/one-time-token.config';
import { UserRepository } from 'src/modules/user/repositories/user.repository';

@Injectable()
export class StudentshipRepository {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

    /**
     * @returns UUID of one time token generated for studentship verification
     */
    async createStudentshipVerificationToken(emailAddress: string) {
        return await this.dataSource.transaction(async (entityManager) => {
            const oneTimeTokenRepository = new OneTimeTokenRepository(
                this.dataSource,
                entityManager,
            );

            return await oneTimeTokenRepository.generateOneTimeToken(
                emailAddress,
                OneTimeTokenType.StudentStatusVerification,
                oneTimeTokenConfig.getExpiryDate(),
            );
        });
    }

    async confirmStudentshipVerification(
        emailAddress: string,
        oneTimeToken: string,
    ) {
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
                    type: OneTimeTokenType.StudentStatusVerification,
                },
                relations: { user: true },
            });
            if (tokenEntry) {
                await userRepository.save({
                    id: tokenEntry.userId,
                    lastVerifiedAsStudent: new Date(),
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
