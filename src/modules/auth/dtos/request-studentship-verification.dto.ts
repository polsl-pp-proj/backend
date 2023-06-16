import { IsDefined, IsEmail, IsString } from 'class-validator';

export class RequestStudentshipVerificationDto {
    @IsDefined({
        message: 'not_defined',
    })
    @IsString({
        message: 'not_string',
    })
    @IsEmail(
        {},
        {
            message: 'not_email',
        },
    )
    academicEmailAddress: string;

    @IsDefined({ message: 'not_defined' })
    @IsString({
        message: 'not_string',
    })
    academicInstitutionId: string;
}
