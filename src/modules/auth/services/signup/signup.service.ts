import { ConflictException, Injectable } from '@nestjs/common';
import { ISignupService } from 'src/interfaces/signup.service.interface';
import { SignupDto } from '../../dtos/signup.dto';
import { IPasswordService } from 'src/interfaces/password.service.interface';
import { UniqueConstraintViolationException } from 'src/exceptions/unique-constraint-violation.exception';
import { SignupRepository } from '../../repositories/signup.repository';
import { SignupMailerService } from '../../modules/signup-mailer/services/signup-mailer/signup-mailer.service';

@Injectable()
export class SignupService implements ISignupService {
    constructor(
        private readonly signupRepository: SignupRepository,
        private readonly passwordService: IPasswordService,
        private readonly signupMailerService: SignupMailerService,
    ) {}

    async signup(signupDto: SignupDto): Promise<string> {
        const hashedPassword = await this.passwordService.createPasswordHash(
            signupDto.password,
        );

        try {
            const accountActivationToken = await this.signupRepository.signup(
                signupDto,
                hashedPassword,
            );

            await this.signupMailerService.sendConfirmSignupMail({
                ...signupDto,
                accountActivationToken,
            });

            return accountActivationToken;
        } catch (ex) {
            if (ex instanceof UniqueConstraintViolationException) {
                throw new ConflictException(ex.message);
            }
            throw ex;
        }
    }

    async confirmSignup(
        emailAddress: string,
        oneTimeToken: string,
    ): Promise<void> {
        const user = await this.signupRepository.confirmSingup(
            emailAddress,
            oneTimeToken,
        );
        await this.signupMailerService.sendSignupConfirmedMail(user);
    }
}
