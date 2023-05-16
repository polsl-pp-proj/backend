import { OrganizationDto } from '../dtos/organization.dto';
import { Organization } from '../entities/organization.entity';

export const convertOrganizationToOrganizationDto = (
    organization: Organization,
): OrganizationDto => {
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

    return {
        id: organization.id,
        name: organization.name,
        members: organizationMembers,
    };
};