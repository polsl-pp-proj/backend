import { Injectable } from '@nestjs/common';
import { OrganizationNotificationRepository } from '../../repositories/organization-notification.repository';
import { UserNotificationRepository } from '../../repositories/user-notification.repository';
import { In } from 'typeorm';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';

@Injectable()
export class NotificationService {
    constructor(
        private readonly organizationNotificationRepository: OrganizationNotificationRepository,
        private readonly userNotificationRepository: UserNotificationRepository,
    ) {}

    async markOrganizationNotificationAsSeen(
        organizationIds: number[],
        notificationId: number,
    ) {
        const updateResult =
            await this.organizationNotificationRepository.update(
                {
                    id: notificationId,
                    // project: {
                    //     projectDraft: { ownerOrganizationId: In(organizationIds) },
                    // },
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
                    // project: {
                    //     projectDraft: { ownerOrganizationId: In(organizationIds) },
                    // },
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
                // project: {
                //     projectDraft: {
                //         ownerOrganizationId: In(usersOwnOrganizationIds),
                //     },
                // },
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
}
