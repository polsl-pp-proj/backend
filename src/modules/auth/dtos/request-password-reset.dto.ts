import { IsDefined, IsEmail } from 'class-validator';

export class RequestPasswordResetDto {
    @IsDefined({ message: 'not_defined' })
    @IsEmail({}, { message: 'not_email' })
    emailAddress: string;
}
