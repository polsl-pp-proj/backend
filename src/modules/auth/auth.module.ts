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

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forFeature([
            Credential,
            IssuedRefreshToken,
            OneTimeToken,
        ]),
        JwtModule.register(jwtModuleConfig),
    ],
    controllers: [AuthController],
    providers: [
        { provide: IAuthService, useClass: AuthService },
        { provide: IAuthTokenService, useClass: AuthTokenService },
        IssuedRefreshTokenRepository,
        AuthTokenStrategy,
        LocalStrategy,
        RefreshTokenStrategy,
    ],
})
export class AuthModule {}
