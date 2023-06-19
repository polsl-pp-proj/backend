import {
    Body,
    ConflictException,
    Controller,
    Param,
    Patch,
    Post,
    UnauthorizedException,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { AuthTokenGuard } from '../../guards/auth-token.guard';
import { AuthTokenPayload } from '../../decorators/param/user.decorator';
import { AuthTokenPayloadDto } from '../../dtos/auth-token-payload.dto';
import { validationConfig } from 'src/configs/validation.config';
import { RequestStudentshipVerificationDto } from '../../dtos/request-studentship-verification.dto';
import { EmailTokenParamsDto } from '../../dtos/email-token-params.dto';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { StudentshipService } from '../../services/studentship/studentship.service';

@Controller({ path: 'studentship', version: '1' })
export class StudentshipController {
    constructor(private readonly studentshipService: StudentshipService) {}

    @Post('verification/request')
    @UseGuards(AuthTokenGuard)
    async requestStudentshipVerification(
        @AuthTokenPayload() user: AuthTokenPayloadDto,
        @Body(new ValidationPipe(validationConfig))
        requestStudentshipVerificationDto: RequestStudentshipVerificationDto,
    ) {
        if (!user.isVerifiedStudent) {
            await this.studentshipService.requestStudentshipVerification(
                user,
                requestStudentshipVerificationDto,
            );
            return;
        }
        throw new ConflictException('user_is_verified_student');
    }

    @Patch('verification/confirm/:emailAddress/:oneTimeToken')
    async confirmStudentshipVerification(
        @Param(new ValidationPipe(validationConfig))
        { emailAddress, oneTimeToken }: EmailTokenParamsDto,
    ) {
        try {
            return await this.studentshipService.confirmStudentshipVerification(
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
