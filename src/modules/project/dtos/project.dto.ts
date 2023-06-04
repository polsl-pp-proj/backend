export class ProjectDto {
    id: number;
    name: string;
    shortDescription: string;
    description: string;
    fundingObjectives: string;
    organizationName: string;
    // TO DO
    // Add assets, orgnization name

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
