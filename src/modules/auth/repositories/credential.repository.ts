import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Credential } from '../entities/credential.entity';

@Injectable()
export class CredentialRepository extends Repository<Credential> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        entityManager?: EntityManager,
    ) {
        super(Credential, entityManager ?? dataSource.createEntityManager());
    }
}
