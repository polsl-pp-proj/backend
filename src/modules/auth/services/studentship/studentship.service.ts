import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { StudentshipMailerService } from '../../modules/studentship-mailer/services/studentship-mailer/studentship-mailer.service';
import { AuthTokenPayloadDto } from '../../dtos/auth-token-payload.dto';
import { RequestStudentshipVerificationDto } from '../../dtos/request-studentship-verification.dto';
import { StudentshipRepository } from '../../repositories/studentship.repository';
import { PolonService } from 'src/modules/polon/services/polon/polon.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StudentshipService {
    constructor(
        private readonly studentshipMailerService: StudentshipMailerService,
        private readonly studentshipRepository: StudentshipRepository,
        private readonly polonService: PolonService,
    ) {}

    async requestStudentshipVerification(
        { firstName, lastName, emailAddress }: AuthTokenPayloadDto,
        requestStudentshipVerificationDto: RequestStudentshipVerificationDto,
    ) {
        try {
            const isAcademicEmailAddress = await firstValueFrom(
                this.polonService.checkAcademicInstitutionEmail(
                    requestStudentshipVerificationDto.academicInstitutionId,
                    requestStudentshipVerificationDto.academicEmailAddress,
                ),
            );
            if (!isAcademicEmailAddress) {
                throw new Error(
                    'provided_email_does_not_contain_university_domain_name',
                );
            }

            const { token } =
                await this.studentshipRepository.createStudentshipVerificationToken(
                    emailAddress,
                );

            await this.studentshipMailerService.sendConfirmStudentshipVerificationMail(
                {
                    accountEmailAddress: emailAddress,
                    firstName,
                    lastName,
                    studentshipVerificationToken: token,
                    universityDomainEmailAddress:
                        requestStudentshipVerificationDto.academicEmailAddress,
                },
            );
        } catch (err) {
            if (err instanceof Error) {
                switch (err.message) {
                    case 'something_went_wrong_when_checking_university_domain_name': {
                        throw new InternalServerErrorException(err.message);
                    }
                    case 'provided_university_does_not_exist_anymore':
                    case 'provided_email_does_not_contain_university_domain_name':
                    case 'provided_university_does_not_exist': {
                        throw new BadRequestException(err.message);
                    }
                    default: {
                        throw err;
                    }
                }
            }
            throw err;
        }
    }

    async confirmStudentshipVerification(
        emailAddress: string,
        oneTimeToken: string,
    ): Promise<void> {
        const user =
            await this.studentshipRepository.confirmStudentshipVerification(
                emailAddress,
                oneTimeToken,
            );
        await this.studentshipMailerService.sendStudentshipVerificationConfirmedMail(
            user,
        );
    }
}
