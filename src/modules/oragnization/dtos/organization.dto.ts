export class OrganizationDto {
    id: number;
    name: string;

    constructor(partialOrganizationDto: Partial<OrganizationDto> = {}) {
        Object.assign(this, partialOrganizationDto);
    }
}
