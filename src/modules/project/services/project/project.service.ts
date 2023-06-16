import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../repositories/project.repository';
import { SimpleProjectDto } from '../../dtos/project.dto';
import { UploadProjectDto } from '../../dtos/upload-project.dto';
import { ProjectDraftRepository } from '../../repositories/project-draft.repository';
import {
    convertProjectDraftToProjectDraftDto,
    convertProjectDraftToSimpleProjectDraftDto,
} from '../../helper/project-draft-to-project-draft-dto';
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
            convertProjectToSimpleProjectDto(
                project,
                project.projectDraft.ownerOrganization.name,
            ),
        );
    }

    async getAllOrganizationsProjects(organizationId: number) {
        const projects = await this.projectRepository.find({
            where: { projectDraft: { ownerOrganizationId: organizationId } },
            relations: { projectDraft: { ownerOrganization: true } },
        });

        return projects.map((project) =>
            convertProjectToSimpleProjectDto(
                project,
                project.projectDraft.ownerOrganization.name,
            ),
        );
    }

    async getProjectById(projectId: number) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
            relations: { projectDraft: { ownerOrganization: true } },
        });

        return convertProjectToProjectDto(
            project,
            project.projectDraft.ownerOrganization.name,
        );
    }
    async getAllDrafts() {
        const drafts = await this.projectDraftRepository.find({
            relations: { ownerOrganization: true },
        });

        return drafts.map((draft) => {
            return convertProjectDraftToSimpleProjectDraftDto(
                draft,
                draft.ownerOrganization.name,
            );
        });
    }

    async getAllOrganizationsDrafts(organizationId: number) {
        const drafts = await this.projectDraftRepository.find({
            where: { ownerOrganizationId: organizationId },
            relations: { ownerOrganization: true },
        });

        return drafts.map((draft) => {
            return convertProjectDraftToSimpleProjectDraftDto(
                draft,
                draft.ownerOrganization.name,
            );
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

        return convertProjectDraftToProjectDraftDto(
            draft,
            draft.ownerOrganization.name,
        );
    }

    async createProjectDraft(
        uploadProjectDto: UploadProjectDto,
        userId: number,
    ) {
        await this.projectDraftRepository.createProjectDraft(
            uploadProjectDto,
            userId,
        );
    }

    async updateProjectDraft(
        projectDraftId: number,
        updateProjectDto: UploadProjectDto,
        userId: number,
    ) {
        await this.projectDraftRepository.updateProjectDraft(
            projectDraftId,
            updateProjectDto,
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
