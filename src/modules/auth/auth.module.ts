import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { Credential } from './entities/credential.entity';
import { IssuedRefreshToken } from './entities/issued-refresh-token.entity';
import { OneTimeToken } from './entities/one-time-token.entity';

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forFeature([
            Credential,
            IssuedRefreshToken,
            OneTimeToken,
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
