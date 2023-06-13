import { Injectable } from '@nestjs/common';
import { OrganizationNotificationRepository } from '../../repositories/organization-notification.repository';
import { UserNotificationRepository } from '../../repositories/user-notification.repository';
import { In, SelectQueryBuilder } from 'typeorm';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { PaginationDto } from 'src/dtos/pagination.dto';
import {
    OrganizationOnlyNotificationType,
    UserOnlyNotificationType,
} from '../../enums/notification-type.enum';
import { INotification } from '../../interfaces/notification.interface';
import { NotificationsDto } from '../../dtos/notifications.dto';
import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import { Observable, Subscription } from 'rxjs';
import { RedisPubSubService } from 'nest-pubsub';
import { NotificationDto } from '../../dtos/notification.dto';
import { NotificationReceiver } from '../../types/notification-receiver.type';
import { CreateNotificationDto } from '../../dtos/create-notification.dto';
import { OrganizationNotificationType } from '../../enums/organization-notification-type.enum';

@Injectable()
export class NotificationService {
    constructor(
        private readonly organizationNotificationRepository: OrganizationNotificationRepository,
        private readonly userNotificationRepository: UserNotificationRepository,
        private readonly redisService: RedisPubSubService,
    ) {}

    getNotificationObservable({
        userId,
        organizations,
        exp,
    }: AuthTokenPayloadDto & { exp: number }) {
        const authTokenExpiresAt = new Date(exp * 1000); // close connection after auth token expires
        const organizationIds = organizations.map((org) => org.organizationId);

        return new Observable<NotificationDto>((subscriber) => {
            const subs: Subscription[] = [];

            const checkExpiry = () => {
                if (authTokenExpiresAt.valueOf() < new Date().valueOf()) {
                    subs.forEach((sub) => sub.unsubscribe());
                    subscriber.complete();
                }
            };

            subs.push(
                this.getNotification('usr', userId).subscribe(
                    (notification) => {
                        subscriber.next(notification);
                        checkExpiry();
                    },
                ),
            );
            organizationIds.forEach((organizationId) => {
                subs.push(
                    this.getNotification('org', organizationId).subscribe(
                        (notification) => {
                            subscriber.next(notification);
                            checkExpiry();
                        },
                    ),
                );
            });
        });
    }

    async getNotificationsForUser(
        userId: number,
        { page, elementsPerPage }: PaginationDto,
    ) {
        return await this.userNotificationRepository.manager.transaction(
            async (manager) => {
                const organizationNotificationRepository =
                        new OrganizationNotificationRepository(
                            manager.connection,
                            manager,
                        ),
                    userNotificationRepository = new UserNotificationRepository(
                        manager.connection,
                        manager,
                    );

                const organizationNotificationsQueryBuilder =
                    organizationNotificationRepository
                        .createQueryBuilder('organizationNotifications')
                        .leftJoin(
                            'organizationNotifications.project',
                            'project',
                        )
                        .leftJoin('project.projectDraft', 'projectDraft')
                        .leftJoin(
                            'projectDraft.ownerOrganization',
                            'organization',
                        )
                        .innerJoin(
                            'organization.organizationUsers',
                            'organizationUsers',
                            'organization.id = organizationUsers.organizationId AND organizationUsers.userId = :organizationUserId',
                            { organizationUserId: userId },
                        )
                        .addSelect('organizationNotifications.id', 'id')
                        .addSelect(
                            'organizationNotifications.subject',
                            'subject',
                        )
                        .addSelect(
                            'organizationNotifications.message',
                            'message',
                        )
                        .addSelect(
                            'organizationNotifications.projectId',
                            'projectId',
                        )
                        .addSelect('organization.name', 'organizationName')
                        .addSelect('organizationNotifications.type', 'type')
                        .addSelect('organizationNotifications.seen', 'seen')
                        .addSelect(
                            'organizationNotifications.createdAt',
                            'createdAt',
                        )
                        .addSelect(
                            'organizationNotifications.updatedAt',
                            'updatedAt',
                        )
                        .addOrderBy('createdAt', 'DESC', 'NULLS LAST')
                        .andWhere(
                            'organizationNotifications.deletedAt IS NULL',
                        );

                const userNotificationsQueryBuilder = userNotificationRepository
                    .createQueryBuilder('userNotifications')
                    .leftJoin('userNotifications.project', 'project')
                    .leftJoin('project.projectDraft', 'projectDraft')
                    .leftJoin('projectDraft.ownerOrganization', 'organization')
                    .addSelect('userNotifications.id', 'id')
                    .addSelect('userNotifications.subject', 'subject')
                    .addSelect('userNotifications.message', 'message')
                    .addSelect('userNotifications.projectId', 'projectId')
                    .addSelect('organization.name', 'organizationName')
                    .addSelect('"message_answer"', 'type')
                    .addSelect('userNotifications.seen', 'seen')
                    .addSelect('userNotifications.createdAt', 'createdAt')
                    .addSelect('userNotifications.updatedAt', 'updatedAt')
                    .addOrderBy('createdAt', 'DESC', 'NULLS LAST')
                    .andWhere('userNotifications.deletedAt IS NULL')
                    .andWhere('userNotifications.userId = :usersUserId', {
                        usersUserId: userId,
                    });

                const queryBuilders = [
                    organizationNotificationsQueryBuilder,
                    userNotificationsQueryBuilder,
                ];

                const sqlQueries = queryBuilders.map((b) => b.getQuery());

                // Merge all the parameters from the other queries into a single object.
                // All parameters have to have unique names.
                const sqlParameters = queryBuilders
                    .map((b) => b.getParameters())
                    .reduce((prev, curr) => ({ ...prev, ...curr }), {});

                // Join all your queries into a single SQL string
                const unionedQuery = '(' + sqlQueries.join(') UNION (') + ')';

                // Create a new querybuilder with the joined SQL string as a FROM subquery
                const unionQueryBuilder = manager
                    .createQueryBuilder()
                    .addSelect('id')
                    .addSelect('subject')
                    .addSelect('message')
                    .addSelect('projectId')
                    .addSelect('organizationName')
                    .addSelect('type')
                    .addSelect('seen')
                    .addSelect('createdAt')
                    .addSelect('updatedAt')
                    .from(`(${unionedQuery})`, 'combined_queries_alias')
                    .setParameters(
                        sqlParameters,
                    ) as SelectQueryBuilder<INotification>;

                const [notifications, count] = await unionQueryBuilder
                    .take(elementsPerPage)
                    .skip(elementsPerPage * (page - 1))
                    .getManyAndCount();

                let pageCount = Math.ceil(count / elementsPerPage);

                if (!pageCount) {
                    pageCount = 1;
                }

                return new NotificationsDto({
                    page,
                    pageCount,
                    notifications: notifications.map(
                        (notification) => new NotificationDto(notification),
                    ),
                });
            },
        );
    }

    async createOrganizationNotification(
        notificationData: CreateNotificationDto & {
            type: OrganizationOnlyNotificationType;
        },
    ) {
        await this.organizationNotificationRepository.manager.transaction(
            async (manager) => {
                const organizationNotificationRepository =
                    new OrganizationNotificationRepository(
                        manager.connection,
                        manager,
                    );
                const notification = organizationNotificationRepository.create({
                    subject: notificationData.subject,
                    message: notificationData.message,
                    projectId: notificationData.projectId,
                    project: { id: notificationData.projectId },
                    senderUserId: notificationData.userId,
                    senderUser: { id: notificationData.userId },
                    type: notificationData.type as unknown as OrganizationNotificationType,
                });
                await organizationNotificationRepository.save(notification);
                Object.assign(
                    notification,
                    organizationNotificationRepository.findOne({
                        where: { id: notification.id },
                        relations: {
                            project: {
                                projectDraft: { ownerOrganization: true },
                            },
                        },
                        select: {
                            project: {
                                projectDraft: {
                                    ownerOrganization: { id: true, name: true },
                                },
                            },
                        },
                    }),
                );

                await this.sendNotification(
                    'org',
                    notification.project.projectDraft.ownerOrganization.id,
                    new NotificationDto({
                        id: notification.id,
                        subject: notification.subject,
                        message: notification.message,
                        projectId: notification.projectId,
                        organizationName:
                            notification.project.projectDraft.ownerOrganization
                                .name,
                        type: notificationData.type,
                        seen: notification.seen,
                        createdAt: notification.createdAt,
                        updatedAt: notification.updatedAt,
                    }),
                );
            },
        );
    }

    async createUserNotification(
        notificationData: CreateNotificationDto & {
            type: UserOnlyNotificationType;
        },
    ) {
        await this.userNotificationRepository.manager.transaction(
            async (manager) => {
                const userNotificationRepository =
                    new UserNotificationRepository(manager.connection, manager);
                const notification = userNotificationRepository.create({
                    subject: notificationData.subject,
                    message: notificationData.message,
                    userId: notificationData.userId,
                    user: { id: notificationData.userId },
                    projectId: notificationData.projectId,
                    project: { id: notificationData.projectId },
                });
                await userNotificationRepository.save(notification);
                Object.assign(
                    notification,
                    userNotificationRepository.findOne({
                        where: { id: notification.id },
                        relations: {
                            project: {
                                projectDraft: { ownerOrganization: true },
                            },
                        },
                        select: {
                            project: {
                                projectDraft: {
                                    ownerOrganization: { id: true, name: true },
                                },
                            },
                        },
                    }),
                );

                await this.sendNotification(
                    'usr',
                    notification.userId,
                    new NotificationDto({
                        id: notification.id,
                        subject: notification.subject,
                        message: notification.message,
                        projectId: notification.projectId,
                        organizationName:
                            notification.project.projectDraft.ownerOrganization
                                .name,
                        type: notificationData.type,
                        seen: notification.seen,
                        createdAt: notification.createdAt,
                        updatedAt: notification.updatedAt,
                    }),
                );
            },
        );
    }

    async markOrganizationNotificationAsSeen(
        organizationIds: number[],
        notificationId: number,
    ) {
        const updateResult =
            await this.organizationNotificationRepository.update(
                {
                    id: notificationId,
                    project: {
                        projectDraft: {
                            ownerOrganizationId: In(organizationIds),
                        },
                    },
                },
                { seen: true },
            );

        if (updateResult.affected === 0) {
            throw new RecordNotFoundException('notification_not_found');
        }
    }

    async markUserNotificationAsSeen(userId: number, notificationId: number) {
        const updateResult = await this.userNotificationRepository.update(
            {
                id: notificationId,
                userId,
            },
            { seen: true },
        );

        if (updateResult.affected === 0) {
            throw new RecordNotFoundException('notification_not_found');
        }
    }

    async markOrganizationNotificationAsNotSeen(
        organizationIds: number[],
        notificationId: number,
    ) {
        const updateResult =
            await this.organizationNotificationRepository.update(
                {
                    id: notificationId,
                    project: {
                        projectDraft: {
                            ownerOrganizationId: In(organizationIds),
                        },
                    },
                },
                { seen: false },
            );

        if (updateResult.affected === 0) {
            throw new RecordNotFoundException('notification_not_found');
        }
    }

    async markUserNotificationAsNotSeen(
        userId: number,
        notificationId: number,
    ) {
        const updateResult = await this.userNotificationRepository.update(
            {
                id: notificationId,
                userId,
            },
            { seen: false },
        );

        if (updateResult.affected === 0) {
            throw new RecordNotFoundException('notification_not_found');
        }
    }

    async removeOrganizationNotification(
        usersOwnOrganizationIds: number[],
        notificationId: number,
    ) {
        const deleteResult =
            await this.organizationNotificationRepository.softDelete({
                id: notificationId,
                project: {
                    projectDraft: {
                        ownerOrganizationId: In(usersOwnOrganizationIds),
                    },
                },
            });

        if (deleteResult.affected === 0) {
            throw new RecordNotFoundException('notification_not_found');
        }
    }

    async removeUserNotification(userId: number, notificationId: number) {
        const deleteResult = await this.userNotificationRepository.softDelete({
            id: notificationId,
            userId,
        });

        if (deleteResult.affected === 0) {
            throw new RecordNotFoundException('notification_not_found');
        }
    }

    private async sendNotification(
        receiver: NotificationReceiver,
        receiverId: number,
        notificationdDto: NotificationDto,
    ) {
        await this.redisService.publish(
            `notify:${receiver}:${receiverId}`,
            notificationdDto,
        );
    }

    private getNotification(
        receiver: NotificationReceiver,
        receiverId: number,
    ) {
        return this.redisService.fromEvent(
            `notify:${receiver}:${receiverId}`,
        ) as Observable<NotificationDto>;
    }
}
