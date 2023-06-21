import { UserRole } from '../enums/user-role.enum';

export class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    isVerifiedStudent?: boolean;
    role?: UserRole;
    emailAddress?: string;
    isActive?: boolean;

    constructor(updateUserDto: UpdateUserDto) {
        Object.assign(this, updateUserDto);
    }
}
