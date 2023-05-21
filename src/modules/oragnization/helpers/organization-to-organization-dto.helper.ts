import { FullOrganizationDto } from '../dtos/full-organization.dto';
import { OrganizationDto } from '../dtos/organization.dto';
import { Organization } from '../entities/organization.entity';

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
    const organizationMembers = organization.organizationUsers.map(
        (organizationUser) => {
            return {
                id: organizationUser.id,
                firstName: organizationUser.user.firstName,
                lastName: organizationUser.user.lastName,
                emailAddress: organizationUser.user.emailAddress,
                role: organizationUser.role,
            };
        },
    );

    return new FullOrganizationDto({
        id: organization.id,
        name: organization.name,
        members: organizationMembers,
    });
};
