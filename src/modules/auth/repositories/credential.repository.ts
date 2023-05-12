import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, MoreThan, Repository } from 'typeorm';
import { Credential } from '../entities/credential.entity';
import { CredentialType } from '../enums/credential-type.enum';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { OneTimeTokenType } from '../enums/one-time-token-type.enum';
import { OneTimeTokenRepository } from './one-time-token.repository';

@Injectable()
export class CredentialRepository extends Repository<Credential> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        entityManager?: EntityManager,
    ) {
        super(Credential, entityManager ?? dataSource.createEntityManager());
    }

    async insertCredential({
        userId,
        type,
        credential,
    }: {
        userId: number;
        type: CredentialType;
        credential: string;
    }): Promise<Credential> {
        const credentialEntity: Credential = this.create({
            userId,
            type,
            credential,
        });
        return await this.save(credentialEntity, { reload: true });
    }

    async updateCredential(
        userId: number,
        newCredential: string,
        credentialType: CredentialType,
    ) {
        return await this.manager.transaction(async (manager) => {
            const credentialRepository = new CredentialRepository(
                manager.connection,
                manager,
            );
            const credential = await credentialRepository.findOne({
                where: {
                    userId,
                    type: credentialType,
                },
            });
            if (credential) {
                credential.credential = newCredential;
                await credentialRepository.save(credential);
                return;
            }
            throw new RecordNotFoundException('user_has_no_password');
        });
    }

    async resetCredential(
        emailAddress: string,
        oneTimeToken: string,
        newCredential: string,
        credentialType: CredentialType,
    ) {
        return await this.manager.transaction(async (manager) => {
            const credentialRepository = new CredentialRepository(
                manager.connection,
                manager,
            );
            const oneTimeTokenRepository = new OneTimeTokenRepository(
                manager.connection,
                manager,
            );

            let tokenType: OneTimeTokenType;

            switch (credentialType) {
                case CredentialType.Password: {
                    tokenType = OneTimeTokenType.PasswordReset;
                    break;
                }
            }

            const tokenEntry = await oneTimeTokenRepository.findOne({
                where: {
                    uuid: oneTimeToken,
                    user: { emailAddress },
                    isActive: true,
                    expiry: MoreThan(new Date()),
                    type: tokenType,
                },
            });
            if (tokenEntry) {
                await credentialRepository.updateCredential(
                    tokenEntry.userId,
                    newCredential,
                    credentialType,
                );
                await oneTimeTokenRepository.save({
                    id: tokenEntry.id,
                    isActive: false,
                });
                return;
            }
            throw new RecordNotFoundException(
                'invalid_token_or_email_address_provided',
            );
        });
    }
}
