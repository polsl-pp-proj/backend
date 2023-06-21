import { IsDefined, IsString, MaxLength, MinLength } from 'class-validator';

export class ApplyForOpenPositionDto {
    @IsDefined({ message: 'not_defined' })
    @IsString({ message: 'not_a_string' })
    @MinLength(10, { message: 'too_short' })
    @MaxLength(500, { message: 'too_long' })
    candidateSummary: string;
}
