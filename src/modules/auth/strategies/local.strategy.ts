import {
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptionsWithRequest, Strategy } from 'passport-local';
import { IPasswordService } from 'src/interfaces/password.service.interface';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private readonly passwordService: IPasswordService) {
        super(<IStrategyOptionsWithRequest>{
            usernameField: 'emailAddress',
            passwordField: 'password',
        });
    }

    async validate(emailAddress: string, password: string): Promise<User> {
        const user = await this.passwordService.validateAndGetUser(
            emailAddress,
            password,
        );
        if (!user) {
            throw new UnauthorizedException();
        }
        if (!user.isActive) {
            throw new ForbiddenException('account_not_active');
        }
        return user;
    }
}
