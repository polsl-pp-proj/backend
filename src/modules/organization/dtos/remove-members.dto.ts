import { IsArray, IsDefined, IsNumber } from 'class-validator';

export class RemoveMembersDto {
    @IsDefined({ message: 'not_defined' })
    @IsArray({ message: 'not_array' })
    @IsNumber({}, { message: 'not_a_number', each: true })
    memberIds: number[];
}
