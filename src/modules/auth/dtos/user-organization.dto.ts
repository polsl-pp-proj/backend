import { OrganizationMemberRole } from 'src/modules/oragnization/enums/organization-member-role.enum';

export class UserOrganizationDto {
    organizationId: number;
    role: OrganizationMemberRole;

    constructor(userOrganizationDto: UserOrganizationDto) {
        Object.assign(this, userOrganizationDto);
    }
}
