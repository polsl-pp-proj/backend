import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Credential } from '../entities/credential.entity';
import { CredentialType } from '../enums/credential-type.enum';

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
}
