import { OpenPositionDto } from './open-position.dto';

export class ProjectDto {
    id: number;
    name: string;
    shortDescription: string;
    description: string;
    fundingObjectives?: string;
    organizationId: number;
    organizationName: string;
    openPositions?: OpenPositionDto[];
    createdAt: number;
    updatedAt: number;
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
    organizationId: number;
    organizationName: string;
    createdAt: number;
    updatedAt: number;
    // Add thumbnail

    constructor(partialSimpleProjectDto: Partial<SimpleProjectDto>) {
        Object.assign(this, partialSimpleProjectDto);
    }
}
