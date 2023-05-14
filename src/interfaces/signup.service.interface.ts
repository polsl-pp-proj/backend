import { SignupDto } from 'src/modules/auth/dtos/signup.dto';

export abstract class ISignupService {
    /**
     * Creates User and their related Credential.
     *
     * @param signupDto DTO with data of user to create
     */
    abstract signup(signupDto: SignupDto): Promise<void>;

    /**
     * Confirms signup and activates account.
     *
     * @param emailAddress User's email address
     * @param oneTimeToken Signup one time token
     */
    abstract confirmSignup(
        emailAddress: string,
        oneTimeToken: string,
    ): Promise<void>;
}
