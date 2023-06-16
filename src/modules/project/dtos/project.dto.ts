import { AssetType } from 'src/modules/asset/enums/asset-type.enum';
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
    thumbnail: AssetDto;

    constructor(partialSimpleProjectDto: Partial<SimpleProjectDto>) {
        Object.assign(this, partialSimpleProjectDto);
    }
}
