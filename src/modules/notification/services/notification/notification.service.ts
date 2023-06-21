import { Injectable, MessageEvent } from '@nestjs/common';
import { OrganizationNotificationRepository } from '../../repositories/organization-notification.repository';
import { UserNotificationRepository } from '../../repositories/user-notification.repository';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { PaginationDto } from 'src/dtos/pagination.dto';
import {
    OrganizationOnlyNotificationType,
    UserOnlyNotificationType,
} from '../../enums/notification-type.enum';
import {
    INotification,
    NotificationQuery,
} from '../../interfaces/notification.interface';
import { NotificationsDto } from '../../dtos/notifications.dto';
import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import { Observable, Subscription } from 'rxjs';
import { RedisPubSubService } from 'nest-pubsub';
import { NotificationDto } from '../../dtos/notification.dto';
import { NotificationReceiver } from '../../types/notification-receiver.type';
import { CreateNotificationDto } from '../../dtos/create-notification.dto';
import { OrganizationNotificationType } from '../../enums/organization-notification-type.enum';
import { NotificationEventType } from '../../types/notification-event-type.type';
import { ProjectDraft } from 'src/modules/project/entities/project-draft.entity';
import { randomUUID } from 'crypto';
import { OrganizationNotification } from '../../entities/organization-notification.entity';

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
    }: AuthTokenPayloadDto & { exp: number }): Observable<MessageEvent> {
        const tempUUID = randomUUID();
        console.log('1. Prepare notification observable');
        console.log({
            tempUUID,
            userId,
            organizations,
            exp: new Date(exp * 1000).toISOString(),
        });
        const authTokenExpiresAt = new Date(exp * 1000); // close connection after auth token expires
        const userOrganizationIds = organizations.map(
            (org) => org.organizationId,
        );

        return new Observable<MessageEvent>((subscriber) => {
            const subs: Subscription[] = [];

            const unsubscribe = () => {
                subs.forEach((sub) => sub.unsubscribe());
            };

            const checkExpiry = () => {
                console.log('Check expiry');
                console.log({
                    tempUUID,
                });
                if (authTokenExpiresAt.valueOf() < new Date().valueOf()) {
                    console.log('Token expired');
                    console.log({
                        tempUUID,
                    });
                    unsubscribe();
                    subscriber.next({
                        type: 'close_connection',
                        data: 'reconnect',
                    });
                    subscriber.complete();
                }
            };

            subs.push(
                this.getNotificationCreated('usr', userId).subscribe(
                    (notification) => {
                        console.log('Got usr notification:created event');
                        console.log({
                            tempUUID,
                            notification,
                        });
                        subscriber.next({
                            type: 'notification:created',
                            data: { ...notification, receiver: 'usr' },
                        });
                        checkExpiry();
                    },
                ),
                this.getNotificationSeen('usr', userId).subscribe(
                    (notificationId) => {
                        console.log('Got usr notification:seen event');
                        console.log({
                            tempUUID,
                            notificationId,
                        });
                        subscriber.next({
                            type: 'notification:seen',
                            data: { id: notificationId, receiver: 'usr' },
                        });
                        checkExpiry();
                    },
                ),
                this.getNotificationNotSeen('usr', userId).subscribe(
                    (notificationId) => {
                        console.log('Got usr notification:not-seen event');
                        console.log({
                            tempUUID,
                            notificationId,
                        });
                        subscriber.next({
                            type: 'notification:not-seen',
                            data: { id: notificationId, receiver: 'usr' },
                        });
                        checkExpiry();
                    },
                ),
                this.getNotificationRemoved('usr', userId).subscribe(
                    (notificationId) => {
                        console.log('Got usr notification:removed event');
                        console.log({
                            tempUUID,
                            notificationId,
                        });
                        subscriber.next({
                            type: 'notification:removed',
                            data: { id: notificationId, receiver: 'usr' },
                        });
                        checkExpiry();
                    },
                ),
            );

            userOrganizationIds.forEach((organizationId) => {
                subs.push(
                    this.getNotificationCreated(
                        'org',
                        organizationId,
                    ).subscribe((notification) => {
                        console.log('Got org notification:created event');
                        console.log({
                            tempUUID,
                            notification,
                        });
                        subscriber.next({
                            type: 'notification:created',
                            data: { ...notification, receiver: 'org' },
                        });
                        checkExpiry();
                    }),
                    this.getNotificationSeen('org', organizationId).subscribe(
                        (notificationId) => {
                            console.log('Got org notification:seen event');
                            console.log({
                                tempUUID,
                                notificationId,
                            });
                            subscriber.next({
                                type: 'notification:seen',
                                data: { id: notificationId, receiver: 'org' },
                            });
                            checkExpiry();
                        },
                    ),
                    this.getNotificationNotSeen(
                        'org',
                        organizationId,
                    ).subscribe((notificationId) => {
                        console.log('Got org notification:not-seen event');
                        console.log({
                            tempUUID,
                            notificationId,
                        });
                        subscriber.next({
                            type: 'notification:not-seen',
                            data: { id: notificationId, receiver: 'org' },
                        });
                        checkExpiry();
                    }),
                    this.getNotificationRemoved(
                        'org',
                        organizationId,
                    ).subscribe((notificationId) => {
                        console.log('Got org notification:removed event');
                        console.log({
                            tempUUID,
                            notificationId,
                        });
                        subscriber.next({
                            type: 'notification:removed',
                            data: { id: notificationId, receiver: 'org' },
                        });
                        checkExpiry();
                    }),
                );
            });

            return () => {
                unsubscribe();
            };
        });
    }

    async getNotificationsForUser(
        userId: number,
        { page, elementsPerPage }: PaginationDto,
    ) {
        return await this.userNotificationRepository.manager.transaction(
            async (manager) => {
                /*
                const organizationNotificationRepository =
                        new OrganizationNotificationRepository(
                            manager.connection,
                            manager,
                        ),
                    userNotificationRepository = new UserNotificationRepository(
                        manager.connection,
                        manager,
                    );

                // const organizationNotificationsQueryBuilder =
                //     organizationNotificationRepository
                //         .createQueryBuilder('organizationNotifications')
                //         .leftJoin('organizationNotifications.projectDraft', 'directProjectDraft')
                //         .leftJoin(
                //             'organizationNotifications.project',
                //             'project',
                //         )
                //         .leftJoin('project.projectDraft', 'projectDraft')
                //         .leftJoin(
                //             'projectDraft.ownerOrganization',
                //             'organization',
                //             'organization.id = projectDraft.ownerOrganizationId OR organization.id = directProjectDraft.ownerOrganizationId'
                //         )
                //         .innerJoin(
                //             'organization.organizationUsers',
                //             'organizationUsers',
                //             'organization.id = organizationUsers.organizationId AND organizationUsers.userId = :organizationUserId',
                //             { organizationUserId: userId },
                //         )
                //         .select('organizationNotifications.id', 'id')
                //         .addSelect(
                //             'organizationNotifications.subject',
                //             'subject',
                //         )
                //         .addSelect(
                //             'organizationNotifications.message',
                //             'message',
                //         )
                //         .addSelect('project.id', 'projectId')
                //         .addSelect('project.name', 'projectName')
                //         .addSelect('organization.id', 'organizationId')
                //         .addSelect('organization.name', 'organizationName')
                //         .addSelect(
                //             '"organizationNotifications"."type"::TEXT',
                //             'type',
                //         )
                //         .addSelect('organizationNotifications.seen', 'seen')
                //         .addSelect(
                //             'organizationNotifications.createdAt',
                //             'createdAt',
                //         )
                //         .addSelect(
                //             'organizationNotifications.updatedAt',
                //             'updatedAt',
                //         )
                //         .addOrderBy(
                //             'organizationNotifications.createdAt',
                //             'DESC',
                //             'NULLS LAST',
                //         );

                // const userNotificationsQueryBuilder = userNotificationRepository
                //     .createQueryBuilder('userNotifications')
                //     .leftJoin('userNotifications.project', 'project')
                //     .leftJoin('project.projectDraft', 'projectDraft')
                //     .leftJoin('projectDraft.ownerOrganization', 'organization')
                //     .select('userNotifications.id', 'id')
                //     .addSelect('userNotifications.subject', 'subject')
                //     .addSelect('userNotifications.message', 'message')
                //     .addSelect('project.id', 'projectId')
                //     .addSelect('project.name', 'projectName')
                //     .addSelect('organization.id', 'organizationId')
                //     .addSelect('organization.name', 'organizationName')
                //     .addSelect("'message_answer'", 'type')
                //     .addSelect('userNotifications.seen', 'seen')
                //     .addSelect('userNotifications.createdAt', 'createdAt')
                //     .addSelect('userNotifications.updatedAt', 'updatedAt')
                //     .addOrderBy(
                //         'userNotifications.createdAt',
                //         'DESC',
                //         'NULLS LAST',
                //     )
                //     .andWhere('userNotifications.userId = :usersUserId', {
                //         usersUserId: userId,
                //     });

                // const queryBuilders = [
                //     organizationNotificationsQueryBuilder,
                //     userNotificationsQueryBuilder,
                // ];

                // const sqlQueries = queryBuilders.map((b) => b.getQuery());

                // // Merge all the parameters from the other queries into a single object.
                // // All parameters have to have unique names.
                // const sqlParameters = queryBuilders
                //     .map((b) => b.getParameters())
                //     .reduce((prev, curr) => ({ ...prev, ...curr }), {});

                // // Join all your queries into a single SQL string
                // const unionedQuery = '(' + sqlQueries.join(') UNION (') + ')';

                // // Create a new querybuilder with the joined SQL string as a FROM subquery
                // const unionQueryBuilder = manager
                //     .createQueryBuilder()
                //     .select('"combined_queries_alias"."id"')
                //     .addSelect('"combined_queries_alias"."subject"')
                //     .addSelect('"combined_queries_alias"."message"')
                //     .addSelect('"combined_queries_alias"."projectId"')
                //     .addSelect('"combined_queries_alias"."projectName"')
                //     .addSelect('"combined_queries_alias"."organizationId"')
                //     .addSelect('"combined_queries_alias"."organizationName"')
                //     .addSelect('"combined_queries_alias"."type"')
                //     .addSelect('"combined_queries_alias"."seen"')
                //     .addSelect('"combined_queries_alias"."createdAt"')
                //     .addSelect('"combined_queries_alias"."updatedAt"')
                //     .from(`(${unionedQuery})`, 'combined_queries_alias')
                //     .addOrderBy(
                //         '"combined_queries_alias"."createdAt"',
                //         'DESC',
                //         'NULLS LAST',
                //     )
                //     .setParameters(sqlParameters);

                // const paginatedQuery = unionQueryBuilder
                //     .take(elementsPerPage)
                //     .skip(elementsPerPage * (page - 1));

                // const notifications = await paginatedQuery.getRawMany(),
                //       count = await paginatedQuery.getCount();
                */

                const notifications = (await manager.query(
                    NotificationQuery(
                        elementsPerPage,
                        elementsPerPage * (page - 1),
                    ),
                    [userId],
                )) as INotification[];
                const count = +(
                    notifications[0] as INotification & { count: string }
                ).count;

                let pageCount = Math.ceil(count / elementsPerPage);

                if (!pageCount) {
                    pageCount = 1;
                }

                return new NotificationsDto({
                    page,
                    pageCount,
                    notifications: notifications
                        .filter((notification) => notification.id !== null)
                        .map(
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
        organizationNotificationRepository = this
            .organizationNotificationRepository,
    ) {
        console.log('1. Creating Organization Notification');
        console.log({ data: notificationData });
        await organizationNotificationRepository.manager.transaction(
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
                console.log('2. Created Notification entity object');
                console.log({ notification });
                if (
                    notification.type ===
                        OrganizationNotificationType.ProjectDraftPublication ||
                    notification.type ===
                        OrganizationNotificationType.ProjectDraftRejection
                ) {
                    notification.projectDraftId = notification.projectId;
                    notification.projectDraft =
                        notification.project as unknown as ProjectDraft;
                    delete notification.project;
                    delete notification.projectId;
                    console.log(
                        '3. Updated Notification entity object data for project draft',
                    );
                    console.log({ notification });
                }
                await organizationNotificationRepository.save(notification);
                console.log('4. Saved Notification entity object');
                console.log({ notification });
                Object.assign(
                    notification,
                    await organizationNotificationRepository.findOne({
                        where: { id: notification.id },
                        relations: {
                            project: {
                                projectDraft: { ownerOrganization: true },
                            },
                            projectDraft: { ownerOrganization: true },
                        },
                        select: {
                            project: {
                                id: true,
                                name: true,
                                projectDraft: {
                                    ownerOrganization: { id: true, name: true },
                                },
                            },
                            projectDraft: {
                                id: true,
                                name: true,
                                ownerOrganization: { id: true, name: true },
                            },
                        },
                    }),
                );
                console.log('5. Filled Notification entity object');
                console.log({ notification });

                await this.sendNotificationCreated(
                    'org',
                    notification.project?.projectDraft?.ownerOrganization?.id ??
                        notification.projectDraft?.ownerOrganization?.id,
                    new NotificationDto({
                        id: notification.id,
                        subject: notification.subject,
                        message: notification.message,
                        projectId:
                            notification.project?.id ??
                            notification.projectDraft?.id,
                        projectName:
                            notification.project?.name ??
                            notification.projectDraft?.name,
                        organizationId:
                            notification.project?.projectDraft
                                ?.ownerOrganization?.id ??
                            notification.projectDraft?.ownerOrganization?.id,
                        organizationName:
                            notification.project?.projectDraft
                                ?.ownerOrganization?.name ??
                            notification.projectDraft?.ownerOrganization?.name,
                        type: notificationData.type,
                        seen: notification.seen,
                        createdAt: notification.createdAt,
                        updatedAt: notification.updatedAt,
                    }),
                );
                console.log('6. Sent notification created event');
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
                                id: true,
                                name: true,
                                projectDraft: {
                                    ownerOrganization: { id: true, name: true },
                                },
                            },
                        },
                    }),
                );

                await this.sendNotificationCreated(
                    'usr',
                    notification.userId,
                    new NotificationDto({
                        id: notification.id,
                        subject: notification.subject,
                        message: notification.message,
                        projectId: notification.project.id,
                        projectName: notification.project.name,
                        organizationId:
                            notification.project.projectDraft.ownerOrganization
                                .id,
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
        organizationId: number,
        notificationId: number,
    ) {
        const updateResult = await this.organizationNotificationRepository
            .createQueryBuilder('organizationNotification')
            .update('organization_notifications')
            .where('organization_notifications.id = :notificationId')
            .andWhere(
                `organization_notifications.id IN (
                    SELECT "id" 
                    FROM "organization_notifications" "n"
                        LEFT JOIN "projects" "p"
                            ON "n"."project_id" = "p"."id"
                        LEFT JOIN "project_drafts" "d"
                            ON "d"."id" = "p"."draft_id"
                                OR "d"."id" = "n"."project_draft_id"
                    WHERE "d"."owner_organization_id" = :organizationId)`,
            )
            .setParameters({ notificationId, organizationId })
            .set({ seen: true })
            .execute();

        if (updateResult.affected === 0) {
            throw new RecordNotFoundException('notification_not_found');
        }

        await this.sendNotificationSeen('org', organizationId, notificationId);
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

        await this.sendNotificationSeen('usr', userId, notificationId);
    }

    async markOrganizationNotificationAsNotSeen(
        organizationId: number,
        notificationId: number,
    ) {
        const updateResult = await this.organizationNotificationRepository
            .createQueryBuilder('organizationNotification')
            .update('organization_notifications')
            .where('organization_notifications.id = :notificationId')
            .andWhere(
                `organization_notifications.id IN (
                    SELECT "id" 
                    FROM "organization_notifications" "n"
                        LEFT JOIN "projects" "p"
                            ON "n"."project_id" = "p"."id"
                        LEFT JOIN "project_drafts" "d"
                            ON "d"."id" = "p"."draft_id"
                                OR "d"."id" = "n"."project_draft_id"
                    WHERE "d"."owner_organization_id" = :organizationId)`,
            )
            .setParameters({ notificationId, organizationId })
            .set({ seen: false })
            .execute();

        if (updateResult.affected === 0) {
            throw new RecordNotFoundException('notification_not_found');
        }

        await this.sendNotificationNotSeen(
            'org',
            organizationId,
            notificationId,
        );
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

        await this.sendNotificationNotSeen('usr', userId, notificationId);
    }

    async removeOrganizationNotification(
        organizationId: number,
        notificationId: number,
    ) {
        const deleteResult = await this.organizationNotificationRepository
            .createQueryBuilder('organizationNotification')
            .delete()
            .from(OrganizationNotification, 'organization_notifications')
            .where('organization_notifications.id = :notificationId')
            .andWhere(
                `organization_notifications.id IN (
                    SELECT "id" 
                    FROM "organization_notifications" "n"
                        LEFT JOIN "projects" "p"
                            ON "n"."project_id" = "p"."id"
                        LEFT JOIN "project_drafts" "d"
                            ON "d"."id" = "p"."draft_id"
                                OR "d"."id" = "n"."project_draft_id"
                    WHERE "d"."owner_organization_id" = :organizationId)`,
            )
            .setParameters({ notificationId, organizationId })
            .execute();

        if (deleteResult.affected === 0) {
            throw new RecordNotFoundException('notification_not_found');
        }

        await this.sendNotificationRemoved(
            'org',
            organizationId,
            notificationId,
        );
    }

    async removeUserNotification(userId: number, notificationId: number) {
        const deleteResult = await this.userNotificationRepository.softDelete({
            id: notificationId,
            userId,
        });

        if (deleteResult.affected === 0) {
            throw new RecordNotFoundException('notification_not_found');
        }

        await this.sendNotificationRemoved('usr', userId, notificationId);
    }

    private async sendNotificationCreated(
        receiver: NotificationReceiver,
        receiverId: number,
        notificationdDto: NotificationDto,
    ) {
        await this.sendNotificationEvent(
            'created',
            receiver,
            receiverId,
            notificationdDto,
        );
    }

    private async sendNotificationRemoved(
        receiver: NotificationReceiver,
        receiverId: number,
        notificationId: number,
    ) {
        await this.sendNotificationEvent(
            'removed',
            receiver,
            receiverId,
            notificationId,
        );
    }

    private async sendNotificationSeen(
        receiver: NotificationReceiver,
        receiverId: number,
        notificationId: number,
    ) {
        await this.sendNotificationEvent(
            'seen',
            receiver,
            receiverId,
            notificationId,
        );
    }

    private async sendNotificationNotSeen(
        receiver: NotificationReceiver,
        receiverId: number,
        notificationId: number,
    ) {
        await this.sendNotificationEvent(
            'not-seen',
            receiver,
            receiverId,
            notificationId,
        );
    }

    private getNotificationCreated(
        receiver: NotificationReceiver,
        receiverId: number,
    ) {
        return this.getNotificationEvent(
            'created',
            receiver,
            receiverId,
        ) as Observable<NotificationDto>;
    }

    private getNotificationRemoved(
        receiver: NotificationReceiver,
        receiverId: number,
    ) {
        return this.getNotificationEvent(
            'removed',
            receiver,
            receiverId,
        ) as Observable<number>;
    }

    private getNotificationSeen(
        receiver: NotificationReceiver,
        receiverId: number,
    ) {
        return this.getNotificationEvent(
            'seen',
            receiver,
            receiverId,
        ) as Observable<number>;
    }

    private getNotificationNotSeen(
        receiver: NotificationReceiver,
        receiverId: number,
    ) {
        return this.getNotificationEvent(
            'not-seen',
            receiver,
            receiverId,
        ) as Observable<number>;
    }

    private async sendNotificationEvent(
        event: NotificationEventType,
        receiver: NotificationReceiver,
        receiverId: number,
        notification: NotificationDto | number,
    ) {
        console.log('Sending notification event');
        console.log({ event, receiver, receiverId, notification });
        await this.redisService.publish(
            `notify:${event}:${receiver}:${receiverId}`,
            notification,
        );
    }

    private getNotificationEvent(
        event: NotificationEventType,
        receiver: NotificationReceiver,
        receiverId: number,
    ) {
        return this.redisService.fromEvent(
            `notify:${event}:${receiver}:${receiverId}`,
        ) as Observable<NotificationDto | number>;
    }
}
