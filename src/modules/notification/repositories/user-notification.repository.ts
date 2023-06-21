import { DataSource, EntityManager, Repository } from 'typeorm';
import { UserNotification } from '../entities/user-notification.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserNotificationRepository extends Repository<UserNotification> {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly entityManager?: EntityManager,
    ) {
        super(
            UserNotification,
            entityManager ?? dataSource.createEntityManager(),
        );
    }
}
