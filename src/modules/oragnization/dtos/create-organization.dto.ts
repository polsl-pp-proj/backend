import { IsEmpty, IsString, MaxLength } from 'class-validator';

export class CreateOrganizationDto {
    @IsString({ message: 'not_string' })
    @IsEmpty({ message: 'empty' })
    @MaxLength(50, { message: 'name_too_long' })
    name: string;
}
