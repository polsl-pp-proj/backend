import {
    IsArray,
    IsDefined,
    IsEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from 'class-validator';
import { OrganizationMemberRole } from '../enums/organization-member-role.enum';
import { MemberDto } from './member.dto';
import { Type } from 'class-transformer';

export class CreateOrganizationDto {
    @IsString({ message: 'not_string' })
    @IsEmpty({ message: 'empty' })
    name: string;
}
