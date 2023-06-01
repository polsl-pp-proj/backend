export class ProjectDto {
    id: number;
    name: string;
    shortDescription: string;
    description: string;
    // TO DO
    // Add assets, orgnization name

    constructor(partialProjectDto: Partial<ProjectDto>) {
        Object.assign(this, partialProjectDto);
    }
}
