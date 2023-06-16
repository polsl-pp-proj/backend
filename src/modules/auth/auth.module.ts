import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { Credential } from './entities/credential.entity';
import { IssuedRefreshToken } from './entities/issued-refresh-token.entity';
import { OneTimeToken } from './entities/one-time-token.entity';
import { AuthTokenService } from './services/auth-token/auth-token.service';
import { IAuthService } from 'src/interfaces/auth.service.interface';
import { IAuthTokenService } from 'src/interfaces/auth-token.service.interface';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleConfig } from './configs/jwt-module.config';
import { IssuedRefreshTokenRepository } from './repositories/issued-refresh-token.repository';
import { AuthTokenStrategy } from './strategies/auth-token.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { PasswordService } from './services/password/password.service';
import { CredentialRepository } from './repositories/credential.repository';
import { IPasswordService } from 'src/interfaces/password.service.interface';
import { SignupController } from './controllers/signup/signup.controller';
import { SignupService } from './services/signup/signup.service';
import { ISignupService } from 'src/interfaces/signup.service.interface';
import { SignupRepository } from './repositories/signup.repository';
import { OneTimeTokenService } from './services/one-time-token/one-time-token.service';
import { IOneTimeTokenService } from 'src/interfaces/one-time-token.service.interface';
import { OneTimeTokenRepository } from './repositories/one-time-token.repository';
import { AuthMailerModule } from './modules/auth-mailer/auth-mailer.module';
import { SignupMailerModule } from './modules/signup-mailer/signup-mailer.module';
import { StripeWebhookStrategy } from './strategies/stripe-webhook.strategy';
import { DonationModule } from '../donation/donation.module';
import { StudentshipController } from './controllers/studentship/studentship.controller';
import { StudentshipService } from './services/studentship/studentship.service';
import { StudentshipMailerModule } from './modules/studentship-mailer/studentship-mailer.module';
import { StudentshipRepository } from './repositories/studentship.repository';

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forFeature([
            Credential,
            IssuedRefreshToken,
            OneTimeToken,
        ]),
        JwtModule.register(jwtModuleConfig),
        AuthMailerModule,
        SignupMailerModule,
        DonationModule,
        StudentshipMailerModule,
    ],
    controllers: [AuthController, SignupController, StudentshipController],
    providers: [
        { provide: IAuthService, useClass: AuthService },
        { provide: IAuthTokenService, useClass: AuthTokenService },
        IssuedRefreshTokenRepository,
        AuthTokenStrategy,
        LocalStrategy,
        RefreshTokenStrategy,
        { provide: IPasswordService, useClass: PasswordService },
        CredentialRepository,
        SignupRepository,
        { provide: ISignupService, useClass: SignupService },
        OneTimeTokenRepository,
        { provide: IOneTimeTokenService, useClass: OneTimeTokenService },
        StripeWebhookStrategy,
        StudentshipService,
        StudentshipRepository,
    ],
})
export class AuthModule {}
