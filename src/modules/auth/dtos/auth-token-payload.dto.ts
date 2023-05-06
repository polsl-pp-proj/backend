import { UserRole } from 'src/modules/user/enums/user-role.enum';

export class AuthTokenPayloadDto {
    userId: number;
    uuid: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isVerifiedStudent: boolean;
    isActive: boolean;

    constructor(partialAuthTokenPayloadDto: Partial<AuthTokenPayloadDto> = {}) {
        Object.assign(this, partialAuthTokenPayloadDto);
    }
}
