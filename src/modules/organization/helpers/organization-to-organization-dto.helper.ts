import { FullOrganizationDto } from '../dtos/full-organization.dto';
import { OrganizationDto } from '../dtos/organization.dto';
import { Organization } from '../entities/organization.entity';
import { convertOrganizationUserToOrganizationMemberDto } from './organization-user-to-organization-member-dto.helper';

export const convertOrganizationToOrganizationDto = (
    organization: Organization,
): OrganizationDto => {
    return new OrganizationDto({
        id: organization.id,
        name: organization.name,
    });
};

export const convertOrganizationToFullOrganizationDto = (
    organization: Organization,
) => {
    return new FullOrganizationDto({
        id: organization.id,
        name: organization.name,
        members: organization.organizationUsers.map((organizationUser) =>
            convertOrganizationUserToOrganizationMemberDto(organizationUser),
        ),
    });
};
