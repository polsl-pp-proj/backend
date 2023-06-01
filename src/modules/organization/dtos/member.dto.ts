import { IsDefined, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { OrganizationMemberRole } from '../enums/organization-member-role.enum';

export class MemberDto {
    @IsNotEmpty({ message: 'not_defined' })
    @IsEmail({}, { message: 'not_an_email_or_empty' })
    emailAddress: string;

    @IsDefined({ message: 'not_defined' })
    @IsEnum(
        { enum: { OrganizationMemberRole } },
        { message: 'not_organization_member_role_enum' },
    )
    memberRole: OrganizationMemberRole;
}
