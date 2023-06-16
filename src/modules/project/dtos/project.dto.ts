import { OpenPositionDto } from './open-position.dto';
import { AssetDto } from 'src/modules/asset/dtos/asset.dto';

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
    assets: AssetDto[];

    constructor(projectDto: ProjectDto) {
        Object.assign(this, projectDto);
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
    thumbnail: AssetDto;

    constructor(simpleProjectDto: SimpleProjectDto) {
        Object.assign(this, simpleProjectDto);
    }
}
