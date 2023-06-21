import { OrganizationMemberDto } from './organization-member.dto';
import { OrganizationDto } from './organization.dto';

export class FullOrganizationDto extends OrganizationDto {
    members: OrganizationMemberDto[];

    constructor(partialOrganizationDto: Partial<FullOrganizationDto> = {}) {
        super(partialOrganizationDto);
        Object.assign(this, partialOrganizationDto);
    }
}
