import { Injectable } from '@nestjs/common';
import { OpenPositionForProjectDto } from '../../dtos/open-position-for-project.dto';
import { ProjectRepository } from '../../repositories/project.repository';
import { NotificationService } from 'src/modules/notification/services/notification/notification.service';
import { ProjectOpenPositionRepository } from '../../repositories/project-open-position.repository';
import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import { OrganizationNotificationRepository } from 'src/modules/notification/repositories/organization-notification.repository';
import { NotificationType } from 'src/modules/notification/enums/notification-type.enum';

@Injectable()
export class OpenPositionService {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly notificationService: NotificationService,
        private readonly openPositionRepository: ProjectOpenPositionRepository,
    ) {}

    async getOpenPositionsForOrganization(
        organizationId: number,
    ): Promise<OpenPositionForProjectDto[]> {
        const projectsWithOpenPositions = await this.projectRepository.find({
            where: { projectDraft: { ownerOrganizationId: organizationId } },
            relations: { openPositions: true },
        });

        return projectsWithOpenPositions.flatMap((project) =>
            project.openPositions.map(
                (openPosition) =>
                    new OpenPositionForProjectDto({
                        id: openPosition.id,
                        name: openPosition.name,
                        description: openPosition.description,
                        requirements: openPosition.requirements,
                        projectId: project.id,
                        projectName: project.name,
                    }),
            ),
        );
    }

    async applyForOpenPosition(
        user: AuthTokenPayloadDto,
        openPositionId: number,
        candidateSummary: string,
    ) {
        await this.openPositionRepository.manager.transaction(
            async (manager) => {
                const openPositionRepository =
                    new ProjectOpenPositionRepository(
                        manager.connection,
                        manager,
                    );
                const organizationNotificationRepository =
                    new OrganizationNotificationRepository(
                        manager.connection,
                        manager,
                    );
                const openPosition = await openPositionRepository.findOne({
                    where: { id: openPositionId },
                    relations: { project: true },
                });

                await this.notificationService.createOrganizationNotification(
                    {
                        userId: user.userId,
                        projectId: openPosition.projectId,
                        subject: `Chęć dołączenia do projektu`,
                        message: `${user.firstName} ${user.lastName} zgłosił(a) swoją chęć dołączenia do projektu ${openPosition.project.name} jako ${openPosition.name}.\n\nOpis użytkownika:\n${candidateSummary}`,
                        type: NotificationType.OpenPositionApplication,
                    },
                    organizationNotificationRepository,
                );
            },
        );
    }
}
