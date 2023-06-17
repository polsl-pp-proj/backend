import { OpenPositionDto } from '../dtos/open-position.dto';
import { ProjectDraftOpenPosition } from '../entities/project-draft-open-position.entity';
import { ProjectOpenPosition } from '../entities/project-open-position.entity';

export const convertProjectOpenPositionToOpenPositionDto = (
    openPosition: ProjectOpenPosition,
) => {
    return new OpenPositionDto({
        id: openPosition.id,
        name: openPosition.name,
        description: openPosition.description,
        requirements: openPosition.requirements,
    });
};

export const convertProjectDraftOpenPositionToOpenPositionDto = (
    openPosition: ProjectDraftOpenPosition,
) => {
    return new OpenPositionDto({
        id: openPosition.id,
        name: openPosition.name,
        description: openPosition.description,
        requirements: openPosition.requirements,
    });
};
