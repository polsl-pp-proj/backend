import { OrganizationMemberDto } from './organization-member.dto';

export class OrganizationDto {
    id: number;
    name: string;
    members: OrganizationMemberDto[];

    constructor(partialOrganizationDto: Partial<OrganizationDto> = {}) {
        Object.assign(this, partialOrganizationDto);
    }
}
