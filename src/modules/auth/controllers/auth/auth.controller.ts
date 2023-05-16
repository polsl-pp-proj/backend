import {
    Body,
    Controller,
    Delete,
    NotFoundException,
    Param,
    Patch,
    Post,
    UnauthorizedException,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import {
    AuthTokenPayload,
    IssuedRefreshToken,
    User,
} from '../../decorators/param/user.decorator';
import { User as UserEntity } from '../../../user/entities/user.entity';
import { ClientIP } from 'src/decorators/param/client-ip.decorator';
import { IAuthService } from 'src/interfaces/auth.service.interface';
import { RefreshTokenGuard } from '../../guards/refresh-token.guard';
import { IssuedRefreshToken as IssuedRefreshTokenEntity } from '../../entities/issued-refresh-token.entity';
import { AuthTokenGuard } from '../../guards/auth-token.guard';
import { AuthTokenPayloadDto } from '../../dtos/auth-token-payload.dto';
import { base64UrlEncode } from 'src/helpers/base64url.helper';
import { validationConfig } from 'src/configs/validation.config';
import { RequestPasswordResetDto } from '../../dtos/request-password-reset.dto';
import { EmailTokenParamsDto } from '../../dtos/email-token-params.dto';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { PasswordDto } from '../../dtos/password.dto';
import { randomUUID } from 'crypto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
    constructor(private readonly authService: IAuthService) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@User() user: UserEntity, @ClientIP() remoteIp: string) {
        return await this.authService.login(user, remoteIp);
    }

    @Patch('refresh')
    @UseGuards(RefreshTokenGuard)
    async refresh(
        @IssuedRefreshToken() issuedRefreshToken: IssuedRefreshTokenEntity,
        @ClientIP() remoteIp: string,
    ) {
        return await this.authService.refreshTokens(
            issuedRefreshToken,
            remoteIp,
        );
    }

    @Delete('logout')
    @UseGuards(RefreshTokenGuard)
    async logout(
        @IssuedRefreshToken() issuedRefreshToken: IssuedRefreshTokenEntity,
    ) {
        await this.authService.logout(issuedRefreshToken);
    }

    @Delete('logout/all')
    @UseGuards(AuthTokenGuard)
    async logoutAll(@AuthTokenPayload() authTokenPayload: AuthTokenPayloadDto) {
        await this.authService.logoutFromAllDevices(authTokenPayload.userId);
    }

    @Post('password/reset')
    async requestPasswordReset(
        @Body(new ValidationPipe(validationConfig))
        { emailAddress }: RequestPasswordResetDto,
    ) {
        try {
            await this.authService.requestPasswordReset(emailAddress);
            return;
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                return {
                    tempToken: `/${base64UrlEncode(
                        emailAddress,
                    )}/${randomUUID()}`,
                };
            }
            throw ex;
        }
    }

    @Patch('password/reset/:emailAddress/:token')
    async confirmPasswordReset(
        @Param(new ValidationPipe(validationConfig))
        { emailAddress, oneTimeToken }: EmailTokenParamsDto,
        @Body(new ValidationPipe(validationConfig))
        { password: newPassword }: PasswordDto,
    ) {
        try {
            await this.authService.resetPassword(
                emailAddress,
                oneTimeToken,
                newPassword,
            );
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new UnauthorizedException(ex.message);
            }
            throw ex;
        }
    }

    @Patch('password/change')
    @UseGuards(AuthTokenGuard)
    async changePassword(
        @AuthTokenPayload() authTokenPayload: AuthTokenPayloadDto,
        @Body(new ValidationPipe(validationConfig))
        { password: newPassword }: PasswordDto,
    ) {
        try {
            await this.authService.changePassword(
                authTokenPayload.userId,
                newPassword,
            );
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
            throw ex;
        }
    }
}
