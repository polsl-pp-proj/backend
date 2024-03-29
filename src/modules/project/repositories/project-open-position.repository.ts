import { DataSource, EntityManager, In, Not, Repository } from 'typeorm';
import { ProjectOpenPosition } from '../entities/project-open-position.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { ProjectDraftOpenPositionRepository } from './project-draft-open-position.repository';
import { CreateOpenPositionDto } from '../dtos/create-open-position.dto';
import { ProjectDraftOpenPosition } from '../entities/project-draft-open-position.entity';

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

    async importOpenPositionsFromDraft(
        projectId: number,
        projectDraftOpenPositions: ProjectDraftOpenPosition[],
    ) {
        await this.editProjectOpenPositions(
            projectId,
            projectDraftOpenPositions.map(
                ({ name, description, requirements }) =>
                    Object.assign(new CreateOpenPositionDto(), {
                        name,
                        description,
                        requirements,
                    } as CreateOpenPositionDto),
            ),
        );
    }

    async editProjectOpenPositions(
        projectId: number,
        openPositions: (CreateOpenPositionDto | number)[],
    ) {
        await this.entityManager.transaction(async (entityManager) => {
            const projectOpenPositionRepository =
                new ProjectOpenPositionRepository(
                    entityManager.connection,
                    entityManager,
                );

            const newOpenPositions: CreateOpenPositionDto[] = [];
            const oldOpenPositionsIds: number[] = [];
            openPositions.forEach((openPosition) => {
                if (typeof openPosition !== 'number') {
                    newOpenPositions.push(openPosition);
                } else {
                    oldOpenPositionsIds.push(openPosition);
                }
            });

            await projectOpenPositionRepository.delete({
                projectId,
                id: Not(In(oldOpenPositionsIds)),
            });

            const newOpenPositionsEntities = newOpenPositions.map(
                (newOpenPosition) =>
                    this.create({
                        name: newOpenPosition.name,
                        description: newOpenPosition.description,
                        requirements: newOpenPosition.requirements,
                        projectId,
                        project: { id: projectId },
                    }),
            );

            await projectOpenPositionRepository.save(newOpenPositionsEntities);
        });
    }
}
