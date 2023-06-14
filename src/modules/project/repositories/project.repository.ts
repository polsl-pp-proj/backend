import {
    DataSource,
    EntityManager,
    EntityRepository,
    Repository,
} from 'typeorm';
import { Project } from '../entities/project.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { SimpleProjectDto } from '../dtos/project.dto';
import { ProjectDraftRepository } from './project-draft.repository';
import {
    convertProjectToProjectDto,
    convertProjectToSimpleProjectDto,
} from '../helper/project-to-project-dto';
import { Injectable } from '@nestjs/common';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { OrganizationRepository } from 'src/modules/organization/repositories/organization.repository';
import { ProjectDraft } from '../entities/project-draft.entity';
import { ModifiedAfterReadException } from 'src/exceptions/modified-after-read.exception';
import { ProjectOpenPositionRepository } from './project-open-position.repository';
import { UploadProjectDto } from '../dtos/upload-project.dto';

@Injectable()
export class ProjectRepository extends Repository<Project> {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private entityManager?: EntityManager,
    ) {
        super(Project, entityManager ?? dataSource.createEntityManager());
    }

    async getAllProjects() {
        const projectDraftRepository = new ProjectDraftRepository(
            this.entityManager.connection,
            this.entityManager,
        );

        const projects = await this.find();

        const simpleProjestDtosPromises = projects.map(async (project) => {
            const draft = await projectDraftRepository.findOne({
                where: { id: project.projectDraftId },
                relations: { ownerOrganization: true },
            });

            return convertProjectToSimpleProjectDto(
                project,
                draft.ownerOrganization.name,
            );
        });

        return await Promise.all(simpleProjestDtosPromises);
    }

    async getAllOrganizationsProjects(organizationId: number) {
        const projectDraftRepository = new ProjectDraftRepository(
            this.entityManager.connection,
            this.entityManager,
        );

        const organizationsDrafts = await projectDraftRepository.find({
            where: { ownerOrganizationId: organizationId },
            relations: { ownerOrganization: true },
        });

        const simpleProjectDtosPromises = organizationsDrafts.map(
            async (draft) => {
                const project = await this.findOne({
                    where: { projectDraftId: draft.id },
                });

                if (project) {
                    return convertProjectToSimpleProjectDto(
                        project,
                        draft.ownerOrganization.name,
                    );
                }
                return null;
            },
        );

        const simpleProjectDtos = await Promise.all(simpleProjectDtosPromises);

        return simpleProjectDtos.filter((simpleProjectDtos) => {
            return simpleProjectDtos != null;
        });
    }

    async getProjectById(projectId: number) {
        const organizationRepository = new OrganizationRepository(
            this.entityManager.connection,
            this.entityManager,
        );

        const project = await this.findOne({
            where: { id: projectId },
            relations: { projectDraft: true },
        });

        const ownerOrganization = await organizationRepository.findOne({
            where: { id: project.projectDraft.ownerOrganizationId },
        });

        return convertProjectToProjectDto(project, ownerOrganization.name);
    }

    async importFormProjectDraft(
        projectDraft: ProjectDraft,
        draftLastModified: Date,
    ) {
        await this.entityManager.transaction(async (entityManager) => {
            const projectRepository = new ProjectRepository(
                entityManager.connection,
                entityManager,
            );
            const projectOpenPositionRepository =
                new ProjectOpenPositionRepository(
                    entityManager.connection,
                    entityManager,
                );

            if (
                projectDraft.updatedAt.valueOf() !== draftLastModified.valueOf()
            ) {
                throw new ModifiedAfterReadException(
                    'draft_modified_after_read',
                );
            }

            let project = await projectRepository.findOne({
                where: {
                    projectDraft: { id: projectDraft.id },
                    projectDraftId: projectDraft.id,
                },
            });

            if (project) {
                project.name = projectDraft.name;
                project.description = projectDraft.description;
                project.shortDescription = projectDraft.shortDescription;
                project.fundingObjectives = projectDraft.fundingObjectives;
            } else {
                project = projectRepository.create({
                    name: projectDraft.name,
                    description: projectDraft.description,
                    shortDescription: projectDraft.shortDescription,
                    fundingObjectives: projectDraft.fundingObjectives,
                    projectDraft: projectDraft,
                    projectDraftId: projectDraft.id,
                });
            }
            await projectOpenPositionRepository.importOpenPositionsFromDraft(
                project.id,
                projectDraft.id,
            );
            await projectRepository.save(project, { reload: true });
        });
    }

    async editProjectContent(
        projectId: number,
        {
            name,
            shortDescription,
            description,
            fundingObjectives,
            openPositions,
        }: UploadProjectDto,
    ) {
        await this.entityManager.transaction(async (entityManager) => {
            const projectRepository = new ProjectRepository(
                entityManager.connection,
                entityManager,
            );
            const projectOpenPositionRepository =
                new ProjectOpenPositionRepository(
                    entityManager.connection,
                    entityManager,
                );

            const queryResult = await projectRepository.update(
                { id: projectId },
                { name, shortDescription, description, fundingObjectives },
            );

            if (queryResult.affected === 0) {
                throw new RecordNotFoundException('project_with_id_not_found');
            }

            await projectOpenPositionRepository.editProjectOpenPositions(
                projectId,
                openPositions,
            );
        });
    }
}
