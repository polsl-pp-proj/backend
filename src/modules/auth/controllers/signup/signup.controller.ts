import {
    Body,
    Controller,
    Param,
    Patch,
    Post,
    UnauthorizedException,
    ValidationPipe,
} from '@nestjs/common';
import { validationConfig } from 'src/configs/validation.config';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { base64UrlEncode } from 'src/helpers/base64url.helper';
import { EmailTokenParamsDto } from '../../dtos/email-token-params.dto';
import { SignupDto } from '../../dtos/signup.dto';
import { ISignupService } from 'src/interfaces/signup.service.interface';

@Controller({ path: 'signup', version: '1' })
export class SignupController {
    constructor(private readonly signupService: ISignupService) {}

    @Post()
    async signup(
        @Body(new ValidationPipe(validationConfig)) signupDto: SignupDto,
    ) {
        const uuid = await this.signupService.signup(signupDto);
        // TODO: remove return
        return {
            tempToken: `/${base64UrlEncode(signupDto.emailAddress)}/${uuid}`,
        };
    }

    @Patch('confirm/:emailAddress/:oneTimeToken')
    async confirmSignup(
        @Param(new ValidationPipe(validationConfig))
        { emailAddress, oneTimeToken }: EmailTokenParamsDto,
    ) {
        try {
            return await this.signupService.confirmSignup(
                emailAddress,
                oneTimeToken,
            );
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new UnauthorizedException(ex.message);
            }
            throw ex;
        }
    }
}
