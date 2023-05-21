import { IsArray, IsDefined, ValidateNested } from 'class-validator';
import { MemberDto } from './member.dto';
import { Type } from 'class-transformer';

export class AddMembersDto {
    @IsDefined({ message: 'not_defined' })
    @IsArray({ message: 'not_an_array' })
    @ValidateNested()
    @Type(() => MemberDto)
    memebers: MemberDto[];
}
