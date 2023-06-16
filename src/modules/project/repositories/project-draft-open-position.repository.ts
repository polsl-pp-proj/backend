import { DataSource, EntityManager, In, Not, Repository } from 'typeorm';
import { ProjectDraftOpenPosition } from '../entities/project-draft-open-position.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateOpenPositionDto } from '../dtos/create-open-position.dto';

export class ProjectDraftOpenPositionRepository extends Repository<ProjectDraftOpenPosition> {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private entityManager?: EntityManager,
    ) {
        super(
            ProjectDraftOpenPosition,
            entityManager ?? dataSource.createEntityManager(),
        );
    }

    async updateOpenPositions(
        draftId: number,
        openPositions: (CreateOpenPositionDto | number)[],
    ) {
        await this.entityManager.transaction(async (entityManager) => {
            const projectDraftOpenPositionRepository =
                new ProjectDraftOpenPositionRepository(
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

            await projectDraftOpenPositionRepository.delete({
                projectDraftId: draftId,
                id: Not(In(oldOpenPositionsIds)),
            });

            const newOpenPositionsEntities = newOpenPositions.map(
                (newOpenPosition) =>
                    this.create({
                        name: newOpenPosition.name,
                        description: newOpenPosition.description,
                        requirements: newOpenPosition.requirements,
                        projectDraftId: draftId,
                        projectDraft: { id: draftId },
                    }),
            );

            await projectDraftOpenPositionRepository.save(
                newOpenPositionsEntities,
            );
        });
    }
}
