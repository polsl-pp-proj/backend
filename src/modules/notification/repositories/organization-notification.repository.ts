import { DataSource, EntityManager, Repository } from 'typeorm';
import { OrganizationNotification } from '../entities/organization-notification.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrganizationNotificationRepository extends Repository<OrganizationNotification> {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly entityManager?: EntityManager,
    ) {
        super(
            OrganizationNotification,
            entityManager ?? dataSource.createEntityManager(),
        );
    }
}
