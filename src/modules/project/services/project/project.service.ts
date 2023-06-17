import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../repositories/project.repository';
import { SimpleProjectDto } from '../../dtos/project.dto';
import { CreateProjectDto } from '../../dtos/create-project.dto';
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
import { UpdateProjectDto } from '../../dtos/update-project.dto';
import { AssetType } from 'src/modules/asset/enums/asset-type.enum';
import { AssetDto } from 'src/modules/asset/dtos/asset.dto';

@Injectable()
export class ProjectService implements IProjectService {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly projectDraftRepository: ProjectDraftRepository,
    ) {}

    async getAllProjects(): Promise<SimpleProjectDto[]> {
        const projects = await this.projectRepository.find({
            where: {
                projectDraft: {
                    galleryEntries: { indexPosition: 0 },
                },
            },
            relations: {
                projectDraft: {
                    ownerOrganization: true,
                    galleryEntries: { asset: true },
                },
            },
        });
        return projects.map((project) =>
            convertProjectToSimpleProjectDto(project),
        );
    }

    async getAllOrganizationsProjects(organizationId: number) {
        const projects = await this.projectRepository.find({
            where: {
                projectDraft: {
                    ownerOrganizationId: organizationId,
                    galleryEntries: { indexPosition: 0 },
                },
            },
            relations: {
                projectDraft: {
                    ownerOrganization: true,
                    galleryEntries: { asset: true },
                },
            },
        });

        return projects.map((project) =>
            convertProjectToSimpleProjectDto(project),
        );
    }

    async getProjectById(projectId: number) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
            relations: {
                projectDraft: {
                    ownerOrganization: true,
                },
                openPositions: true,
                galleryEntries: { asset: true },
                categories: { category: true },
            },
        });

        return convertProjectToProjectDto(project);
    }

    async getAllDrafts() {
        const drafts = await this.projectDraftRepository.find({
            where: { galleryEntries: { indexPosition: 0 } },
            relations: {
                ownerOrganization: true,
                galleryEntries: { asset: true },
            },
        });

        return drafts.map((draft) => {
            return convertProjectDraftToSimpleProjectDto(draft);
        });
    }

    async getAllOrganizationsDrafts(organizationId: number) {
        const drafts = await this.projectDraftRepository.find({
            where: {
                ownerOrganizationId: organizationId,
                galleryEntries: { indexPosition: 0 },
            },
            relations: {
                ownerOrganization: true,
                galleryEntries: { asset: true },
            },
        });

        return drafts.map((draft) => {
            return convertProjectDraftToSimpleProjectDto(draft);
        });
    }

    async getDraftById(draftId: number, user: AuthTokenPayloadDto) {
        const draft = await this.projectDraftRepository.findOne({
            where: { id: draftId },
            relations: {
                ownerOrganization: true,
                openPositions: true,
                galleryEntries: { asset: true },
                categories: { category: true },
            },
        });

        if (!draft) {
            throw new RecordNotFoundException('draft_with_id_not_found');
        }

        if (
            !user.organizations.some(
                (userOrganization) =>
                    userOrganization.organizationId ===
                    draft.ownerOrganizationId,
            )
        ) {
            throw new UserNotInOrganizationException(
                'user_not_in_organization',
            );
        }

        return convertProjectDraftToProjectDto(draft);
    }

    async createProjectDraft(
        organizationId: number,
        createProjectDto: CreateProjectDto,
        files: Express.Multer.File[],
    ) {
        this.setNewAssetPaths(createProjectDto, files);
        await this.projectDraftRepository.createProjectDraft(
            organizationId,
            createProjectDto,
        );
    }

    async updateProjectDraft(
        userId: number,
        projectDraftId: number,
        updateProjectDto: UpdateProjectDto,
        files: Express.Multer.File[],
    ) {
        this.setNewAssetPaths(updateProjectDto, files);
        await this.projectDraftRepository.updateProjectDraft(
            userId,
            projectDraftId,
            updateProjectDto,
        );
    }

    async editProjectContent(
        projectId: number,
        updateProjectDto: UpdateProjectDto,
        files: Express.Multer.File[],
    ) {
        this.setNewAssetPaths(updateProjectDto, files);
        await this.projectRepository.editProjectContent(
            projectId,
            updateProjectDto,
        );
    }

    private setNewAssetPaths(
        uploadProjectDto: CreateProjectDto | UpdateProjectDto,
        files: Express.Multer.File[],
    ) {
        uploadProjectDto.assets = uploadProjectDto.assets
            .map((asset: number | AssetDto): AssetDto | null => {
                if (typeof asset === 'number') {
                    if (files?.length > asset) {
                        return {
                            title: 'n/a',
                            type: AssetType.Image,
                            url: files[asset].path,
                        };
                    }
                    return null;
                }
                return asset;
            })
            .filter((value) => value !== null);
    }
}
