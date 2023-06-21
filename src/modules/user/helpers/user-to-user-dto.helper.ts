import { UserOrganizationDto } from 'src/modules/auth/dtos/user-organization.dto';
import { UserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

export const userToUserDto = (user: User) => {
    return new UserDto({
        id: user.id,
        emailAddress: user.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        lastVerifiedAsStudent: user.lastVerifiedAsStudent.valueOf(),
        role: user.role,
        userOrganizations: user.userOrganizations.map(
            (org) =>
                new UserOrganizationDto({
                    organizationId: org.organizationId,
                    role: org.role,
                }),
        ),
        isActive: user.isActive,
        createdAt: user.createdAt.valueOf(),
    });
};
