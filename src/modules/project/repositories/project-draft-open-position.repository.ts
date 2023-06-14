import { DataSource, EntityManager, In, Not, Repository } from 'typeorm';
import { ProjectDraftOpenPosition } from '../entities/project-draft-open-position.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { UploadOpenPositionDto } from '../dtos/upload-open-position.dto';

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
        openPositions: UploadOpenPositionDto[],
        draftId: number,
    ) {
        // Filter openPositions without id nr (new openPositons that are not in database yet)
        const newOpenPositions = openPositions.filter((openPositionDto) => {
            if (!openPositionDto.id) {
                return true;
            }
        });

        // Filter openPositions' Ids present in database
        const oldOpenPositionsIds = openPositions
            .filter((openPositionDto) => openPositionDto.id)
            .map((openPositionDto) => {
                return openPositionDto.id;
            });

        await this.delete({
            projectDraftId: draftId,
            id: Not(In(oldOpenPositionsIds)),
        });

        const newOpenPositionsPromises = newOpenPositions.map(
            async (newOpenPosition) => {
                return this.create({
                    name: newOpenPosition.name,
                    description: newOpenPosition.description,
                    requirements: newOpenPosition.requirements,
                    projectDraftId: draftId,
                    projectDraft: { id: draftId },
                });
            },
        );

        const createdOpenPositions = await Promise.all(
            newOpenPositionsPromises,
        );

        await this.save(createdOpenPositions);
    }
}
