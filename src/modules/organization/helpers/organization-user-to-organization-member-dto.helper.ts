import { OrganizationMemberDto } from '../dtos/organization-member.dto';
import { OrganizationUser } from '../entities/organization-user.entity';

export const convertOrganizationUserToOrganizationMemberDto = (
    organizationUser: OrganizationUser,
) => {
    return new OrganizationMemberDto({
        id: organizationUser.userId,
        firstName: organizationUser.user.firstName,
        lastName: organizationUser.user.lastName,
        emailAddress: organizationUser.user.emailAddress,
        role: organizationUser.role,
    });
};
