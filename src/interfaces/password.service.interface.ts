import { User } from 'src/modules/user/entities/user.entity';

export abstract class IPasswordService {
    abstract validateAndGetUser(
        emailAddress: string,
        password: string,
    ): Promise<User>;
}
