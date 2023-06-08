import { OpenPositionDto } from './open-position.dto';

export class ProjectDto {
    id: number;
    name: string;
    shortDescription: string;
    description: string;
    fundingObjectives: string;
    organizationName: string;
    openPositions: OpenPositionDto[];
    // TO DO
    // Add assets

    constructor(partialProjectDto: Partial<ProjectDto>) {
        Object.assign(this, partialProjectDto);
    }
}

export class SimpleProjectDto {
    id: number;
    name: string;
    shortDescription: string;
    organizationName: string;
    // Add thumbnail

    constructor(partialSimpleProjectDto: Partial<SimpleProjectDto>) {
        Object.assign(this, partialSimpleProjectDto);
    }
}
