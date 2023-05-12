import {
    IsBoolean,
    IsDefined,
    IsEmail,
    IsString,
    MinLength,
} from 'class-validator';
import { IsTrue } from 'src/decorators/validator/is-true.decorator';

export class SignupDto {
    @IsDefined({
        message: 'not_defined',
    })
    @IsString({
        message: 'not_string',
    })
    @MinLength(2)
    firstName: string;

    @IsDefined({
        message: 'not_defined',
    })
    @IsString({
        message: 'not_string',
    })
    @MinLength(2)
    lastName: string;

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
    emailAddress: string;

    @IsDefined({
        message: 'not_defined',
    })
    @IsString({
        message: 'not_string',
    })
    password: string;

    @IsDefined({
        message: 'not_defined',
    })
    @IsBoolean({ message: 'not_boolean' })
    @IsTrue({ message: 'not_true' })
    consent: boolean;
}
