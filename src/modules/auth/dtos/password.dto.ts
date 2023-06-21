import { IsDefined, IsString } from 'class-validator';

export class PasswordDto {
    @IsDefined({
        message: 'not_defined',
    })
    @IsString({
        message: 'not_string',
    })
    password: string;
}
