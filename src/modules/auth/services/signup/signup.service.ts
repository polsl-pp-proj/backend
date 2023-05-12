import { ConflictException, Injectable } from '@nestjs/common';
import { ISignupService } from 'src/interfaces/signup.service.interface';
import { SignupDto } from '../../dtos/signup.dto';
import { IPasswordService } from 'src/interfaces/password.service.interface';
import { UniqueConstraintViolationException } from 'src/exceptions/unique-constraint-violation.exception';
import { SignupRepository } from '../../repositories/signup.repository';

@Injectable()
export class SignupService implements ISignupService {
    constructor(
        private readonly signupRepository: SignupRepository,
        private readonly passwordService: IPasswordService,
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
            // TODO: send signup confirmation email

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
        await this.signupRepository.confirmSingup(emailAddress, oneTimeToken);
    }
}
