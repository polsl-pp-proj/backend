import { DataSource, EntityManager, In, Not, Repository } from 'typeorm';
import { ProjectDraft } from '../entities/project-draft.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { UploadProjectDto } from '../dtos/upload-project.dto';
import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { ProjectDraftSubmissionRepository } from './project-draft-submission.repository';
import { ProjectDraftSubmissionStatus } from '../enums/project-draft-submission-status.enum';
import { ProjectDraftOpenPositionRepository } from './project-draft-open-position.repository';
import { OrganizationRepository } from 'src/modules/organization/repositories/organization.repository';
import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import { UserNotInOrganizationException } from 'src/exceptions/user-not-in-organization.exception';
import { UserRole } from 'src/modules/user/enums/user-role.enum';

@Injectable()
export class ProjectDraftRepository extends Repository<ProjectDraft> {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private entityManager?: EntityManager,
    ) {
        super(ProjectDraft, entityManager ?? dataSource.createEntityManager());
    }

    async createProjectDraft(
        uploadProjectDto: UploadProjectDto,
        userId: number,
    ) {
        await this.entityManager.transaction(async (entityManager) => {
            const projectDraftRepository = new ProjectDraftRepository(
                entityManager.connection,
                entityManager,
            );
            const submissionRepository = new ProjectDraftSubmissionRepository(
                entityManager.connection,
                entityManager,
            );
            const organizationRepository = new OrganizationRepository(
                entityManager.connection,
                entityManager,
            );
            const projectDraftOpenPositionRepository =
                new ProjectDraftOpenPositionRepository(
                    entityManager.connection,
                    entityManager,
                );
            const organization = await organizationRepository.findOne({
                where: { id: uploadProjectDto.ownerOrganizationId },
                relations: { organizationUsers: true },
            });

            if (!organization) {
                throw new RecordNotFoundException(
                    'organization_with_id_not_found',
                );
            }

            const organizartionUser = organization.organizationUsers.find(
                (organizationUser) => organizationUser.userId === userId,
            );

            if (!organizartionUser) {
                throw new UserNotInOrganizationException(
                    'user_not_in_organization',
                );
            }

            const draft = projectDraftRepository.create({
                name: uploadProjectDto.name,
                shortDescription: uploadProjectDto.shortDescription,
                description: uploadProjectDto.description,
                ownerOrganization: { id: uploadProjectDto.ownerOrganizationId },
                ownerOrganizationId: uploadProjectDto.ownerOrganizationId,
                fundingObjectives: uploadProjectDto.fundingObjectives,
            });

            await projectDraftOpenPositionRepository.updateOpenPositions(
                uploadProjectDto.openPositions,
                draft.id,
            );

            await projectDraftRepository.save(draft, { reload: true });
            await submissionRepository.createSubmission(draft.id);
        });
    }

    async updateProjectDraft(
        projectDraftId: number,
        updateProjectDto: UploadProjectDto,
        userId: number,
    ) {
        this.entityManager.transaction(async (entityManager) => {
            const projectDraftRepository = new ProjectDraftRepository(
                entityManager.connection,
                entityManager,
            );
            const submissionRepository = new ProjectDraftSubmissionRepository(
                entityManager.connection,
                entityManager,
            );
            const projectDraftOpenPositionRepository =
                new ProjectDraftOpenPositionRepository(
                    entityManager.connection,
                    entityManager,
                );

            const organizationRepository = new OrganizationRepository(
                entityManager.connection,
                entityManager,
            );

            const organization = await organizationRepository.findOne({
                where: { id: updateProjectDto.ownerOrganizationId },
                relations: { organizationUsers: true },
            });

            if (!organization) {
                throw new RecordNotFoundException(
                    'organization_with_id_not_found',
                );
            }

            const organizationUser = organization.organizationUsers.find(
                (organizationUser) => organizationUser.userId === userId,
            );

            if (!organizationUser) {
                throw new UserNotInOrganizationException(
                    'user_not_in_organization',
                );
            }

            let draft = await projectDraftRepository.findOne({
                where: { id: projectDraftId },
            });

            if (!draft) {
                throw new RecordNotFoundException('draft_with_id_not_found');
            }

            draft = await projectDraftRepository.save({
                ...draft,
                description: updateProjectDto.description,
                shortDescription: updateProjectDto.shortDescription,
                name: updateProjectDto.name,
                fundingObjectives: updateProjectDto.fundingObjectives,
                ownerOrganization: { id: updateProjectDto.ownerOrganizationId },
                ownerOrganizationId: updateProjectDto.ownerOrganizationId,
            });

            await projectDraftOpenPositionRepository.updateOpenPositions(
                updateProjectDto.openPositions,
                draft.id,
            );

            const submission = await submissionRepository.findOne({
                where: {
                    projectDraftId: draft.id,
                    status: ProjectDraftSubmissionStatus.ToBeResolved,
                },
            });

            if (!submission) {
                await submissionRepository.createSubmission(draft.id);
            }
        });
    }
}
