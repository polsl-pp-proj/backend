import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsDefined, IsEmail, IsUUID } from 'class-validator';
import { base64UrlDecode } from 'src/helpers/base64url.helper';
import validator from 'validator';

export class EmailTokenParamsDto {
    @IsDefined({ message: 'not_defined' })
    @IsEmail({}, { message: 'not_email_address' })
    @Transform((params) => {
        if (validator.isBase64(params.value, { urlSafe: true })) {
            return base64UrlDecode(params.value);
        }
        throw new BadRequestException('not_url_encoded_email_address');
    })
    emailAddress: string;

    @IsDefined({ message: 'not_defined' })
    @IsUUID('4', { message: 'not_uuid' })
    oneTimeToken: string;
}
