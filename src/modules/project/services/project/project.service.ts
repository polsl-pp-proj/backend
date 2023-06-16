import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../repositories/project.repository';
import { SimpleProjectDto } from '../../dtos/project.dto';
import { UploadProjectDto } from '../../dtos/upload-project.dto';
import { ProjectDraftRepository } from '../../repositories/project-draft.repository';
import {
    convertProjectDraftToProjectDto,
    convertProjectDraftToSimpleProjectDto,
} from '../../helper/project-draft-to-project-dto';
import {
    convertProjectToProjectDto,
    convertProjectToSimpleProjectDto,
} from '../../helper/project-to-project-dto';
import { IProjectService } from 'src/interfaces/project.service.interface';
import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { UserNotInOrganizationException } from 'src/exceptions/user-not-in-organization.exception';
import { UserRole } from 'src/modules/user/enums/user-role.enum';

@Injectable()
export class ProjectService implements IProjectService {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly projectDraftRepository: ProjectDraftRepository,
    ) {}

    async getAllProjects(): Promise<SimpleProjectDto[]> {
        const projects = await this.projectRepository.find({
            relations: { projectDraft: { ownerOrganization: true } },
        });
        return projects.map((project) =>
            convertProjectToSimpleProjectDto(project),
        );
    }

    async getAllOrganizationsProjects(organizationId: number) {
        const projects = await this.projectRepository.find({
            where: { projectDraft: { ownerOrganizationId: organizationId } },
            relations: { projectDraft: { ownerOrganization: true } },
        });

        return projects.map((project) =>
            convertProjectToSimpleProjectDto(project),
        );
    }

    async getProjectById(projectId: number) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
            relations: { projectDraft: { ownerOrganization: true } },
        });

        return convertProjectToProjectDto(project);
    }
    async getAllDrafts() {
        const drafts = await this.projectDraftRepository.find({
            relations: { ownerOrganization: true },
        });

        return drafts.map((draft) => {
            return convertProjectDraftToSimpleProjectDto(draft);
        });
    }

    async getAllOrganizationsDrafts(
        organizationId: number,
        user: AuthTokenPayloadDto,
    ) {
        const drafts = await this.projectDraftRepository.find({
            where: { ownerOrganizationId: organizationId },
            relations: { ownerOrganization: { organizationUsers: true } },
        });

        if (drafts.length === 0) {
            throw new RecordNotFoundException(
                'drafts_with_organization_id_not_found',
            );
        }

        const organizartionUser =
            drafts[0].ownerOrganization.organizationUsers.find(
                (organizartionUser) => organizartionUser.userId === user.userId,
            );

        if (!organizartionUser && user.role === UserRole.BasicUser) {
            throw new UserNotInOrganizationException(
                'user_not_in_organization',
            );
        }

        return drafts.map((draft) => {
            return convertProjectDraftToSimpleProjectDto(draft);
        });
    }

    async getDraftById(draftId: number, user: AuthTokenPayloadDto) {
        const draft = await this.projectDraftRepository.findOne({
            where: { id: draftId },
            relations: { ownerOrganization: { organizationUsers: true } },
        });

        if (!draft) {
            throw new RecordNotFoundException('draft_with_id_not_found');
        }

        const organizartionUser =
            draft.ownerOrganization.organizationUsers.find(
                (organizartionUser) => organizartionUser.userId === user.userId,
            );

        if (!organizartionUser && user.role === UserRole.BasicUser) {
            throw new UserNotInOrganizationException(
                'user_not_in_organization',
            );
        }

        return convertProjectDraftToProjectDto(draft);
    }

    async createProjectDraft(
        uploadProjectDto: UploadProjectDto,
        organizationId: number,
        userId: number,
    ) {
        await this.projectDraftRepository.createProjectDraft(
            uploadProjectDto,
            organizationId,
            userId,
        );
    }

    async updateProjectDraft(
        projectDraftId: number,
        updateProjectDto: UploadProjectDto,
        organizationId: number,
        userId: number,
    ) {
        await this.projectDraftRepository.updateProjectDraft(
            projectDraftId,
            updateProjectDto,
            organizationId,
            userId,
        );
    }

    async editProjectContent(
        projectId: number,
        uploadProjectDto: UploadProjectDto,
    ) {
        await this.projectRepository.editProjectContent(
            projectId,
            uploadProjectDto,
        );
    }
}
