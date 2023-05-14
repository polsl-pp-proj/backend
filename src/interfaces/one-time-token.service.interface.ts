import { OneTimeTokenType } from 'src/modules/auth/enums/one-time-token-type.enum';
import { User } from 'src/modules/user/entities/user.entity';

export abstract class IOneTimeTokenService {
    /**
     * Generates one time token for user and returns it's uuid.
     *
     * @param emailAddress User's email address
     * @param type type of one time token to generate.
     */
    abstract generateOneTimeToken(
        emailAddress: string,
        type: OneTimeTokenType,
    ): Promise<{ token: string; user: User }>;
}
