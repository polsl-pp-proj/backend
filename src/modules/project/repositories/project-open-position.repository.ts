import { DataSource, EntityManager, Repository } from 'typeorm';
import { ProjectOpenPosition } from '../entities/project-open-position.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { ProjectDraftOpenPositionRepository } from './project-draft-open-position.repository';
import { UploadOpenPositionDto } from '../dtos/upload-open-position.dto';

export class ProjectOpenPositionRepository extends Repository<ProjectOpenPosition> {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private entityManager?: EntityManager,
    ) {
        super(
            ProjectOpenPosition,
            entityManager ?? dataSource.createEntityManager(),
        );
    }

    async importOpenPositionsFromDraft(projectId: number, draftId: number) {
        await this.entityManager.transaction(async (entityManager) => {
            const projectOpenPositionRepository =
                new ProjectOpenPositionRepository(
                    entityManager.connection,
                    entityManager,
                );
            const projectDraftOpenPositionRepository =
                new ProjectDraftOpenPositionRepository(
                    entityManager.connection,
                    entityManager,
                );

            const draftOpenPositions =
                await projectDraftOpenPositionRepository.find({
                    where: { projectDraftId: draftId },
                });

            await this.editProjectOpenPositions(projectId, draftOpenPositions);
        });
    }

    async editProjectOpenPositions(
        projectId: number,
        uploadOpenPositionDto: UploadOpenPositionDto[],
    ) {
        await this.entityManager.transaction(async (entityManager) => {
            const projectOpenPositionRepository =
                new ProjectOpenPositionRepository(
                    entityManager.connection,
                    entityManager,
                );

            await projectOpenPositionRepository.delete({ projectId });

            if (uploadOpenPositionDto.length === 0) {
                return;
            }

            const projectOpenPositionsPromise = uploadOpenPositionDto.map(
                async (openPosition) => {
                    return projectOpenPositionRepository.create({
                        name: openPosition.name,
                        description: openPosition.description,
                        projectId: projectId,
                        project: { id: projectId },
                        requirements: openPosition.requirements,
                    });
                },
            );

            const createdOpenPositions = await Promise.all(
                projectOpenPositionsPromise,
            );

            await projectOpenPositionRepository.save(createdOpenPositions);
        });
    }
}
