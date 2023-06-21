import {
    IsDefined,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';
import { OrganizationMemberRole } from '../enums/organization-member-role.enum';

export class OrganizationMemberDto {
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
    id: number;

    @IsString({ message: 'not_a_string' })
    @IsNotEmpty({ message: 'not_defined_or_empty' })
    firstName: string;

    @IsString({ message: 'not_a_string' })
    @IsNotEmpty({ message: 'not_defined_or_empty' })
    lastName: string;

    @IsNotEmpty({ message: 'not_defined' })
    @IsEmail({}, { message: 'not_an_emial_or_empty' })
    emailAddress: string;

    @IsDefined({ message: 'not_defined' })
    @IsEnum(
        { enum: { OrganizationMemberRole } },
        { message: 'not_orgnizaiton_member_role_enum' },
    )
    role: OrganizationMemberRole;

    constructor(organizationMemberDto: OrganizationMemberDto) {
        Object.assign(this, organizationMemberDto);
    }
}
