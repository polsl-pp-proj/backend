import { IsDefined, IsString, MaxLength, MinLength } from 'class-validator';

export class ProjectMessageDto {
    @IsDefined({ message: 'not_defined' })
    @IsString({ message: 'not_a_string' })
    @MinLength(5, { message: 'too_short' })
    @MaxLength(150, { message: 'too_long' })
    subject: string;

    @IsDefined({ message: 'not_defined' })
    @IsString({ message: 'not_a_string' })
    @MinLength(5, { message: 'too_short' })
    @MaxLength(500, { message: 'too_long' })
    message: string;
}
