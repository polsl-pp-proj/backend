import {
    IsArray,
    IsDefined,
    IsEmpty,
    IsNumber,
    IsString,
} from 'class-validator';
import { OrganizationMemberRole } from '../enums/organization-member-role.enum';
import { AddMemberDto } from './add-member.dto';

export class CreateOrganizationDto {
    @IsString({ message: 'not_string' })
    @IsEmpty({ message: 'empty' })
    name: string;

    @IsDefined({ message: 'not_defined' })
    @IsArray({ message: 'not_array' })
    members: AddMemberDto[];
}
