import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { OrganizationUser } from '../entities/organization-user.entity';

@Injectable()
export class OrganizationUserRepository extends Repository<OrganizationUser> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        entityManager?: EntityManager,
    ) {
        super(
            OrganizationUser,
            entityManager ?? dataSource.createEntityManager(),
        );
    }
}
