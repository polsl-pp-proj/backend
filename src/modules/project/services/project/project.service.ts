import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../repositories/project.repository';
import { SimpleProjectDto } from '../../dtos/project.dto';
import { UploadProjectDto } from '../../dtos/upload-project.dto';
import { ProjectDraftRepository } from '../../repositories/project-draft.repositry';
import {
    converProjectDraftToProjectDraftDto,
    converProjectDraftToSimpleProjectDraftDto,
} from '../../helper/project-draft-to-project-draft-dto';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';

@Injectable()
export class ProjectService {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly projectDraftRepository: ProjectDraftRepository,
    ) {}

    async getAllProjects(): Promise<SimpleProjectDto[]> {
        return await this.projectRepository.getAllProjects();
    }

    async getAllOrganizationsProjects(organizationId: number) {
        return await this.projectRepository.getAllOrganizationsProjects(
            organizationId,
        );
    }

    async getProjectById(projectId: number) {
        return await this.projectRepository.getProjectById(projectId);
    }
    async getAllDrafts() {
        const drafts = await this.projectDraftRepository.find({
            relations: { ownerOrganization: true },
        });

        return drafts.map((draft) => {
            return converProjectDraftToSimpleProjectDraftDto(
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
            return converProjectDraftToSimpleProjectDraftDto(
                draft,
                draft.ownerOrganization.name,
            );
        });
    }

    async getDraftById(draftId: number, userId: number) {
        const draft = await this.projectDraftRepository.getDraftById(draftId);
        return converProjectDraftToProjectDraftDto(
            draft,
            draft.ownerOrganization.name,
        );
    }

    async createProjectDraft(
        uploadProjectDto: UploadProjectDto,
        userId: number,
    ) {
        await this.projectDraftRepository.createProjectDraft(uploadProjectDto);
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
        const { name, shortDescription, description, fundingObjectives } =
            uploadProjectDto;
        const queryResult = await this.projectRepository.update(
            { id: projectId },
            { name, shortDescription, description, fundingObjectives },
        );

        if (!queryResult.affected) {
            throw new RecordNotFoundException('project_with_id_not_found');
        }
    }
}
