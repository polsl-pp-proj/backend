import { Controller, Delete, Patch, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { User } from '../../decorators/param/user.decorator';
import { User as UserEntity } from '../../../user/entities/user.entity';
import { ClientIP } from 'src/decorators/param/client-ip.decorator';
import { IAuthService } from 'src/interfaces/auth.service.interface';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
    constructor(private readonly authService: IAuthService) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@User() user: UserEntity, @ClientIP() remoteIp: string) {
        return await this.authService.login(user, remoteIp);
    }

    @Patch('refresh')
    async refresh() {}

    @Delete('logout')
    async logout() {}

    @Delete('logout/all')
    async logoutAll() {}

    @Post('password/reset')
    async requestPasswordReset() {}

    @Patch('password/reset/:emailAddress/:token')
    async confirmPasswordReset() {}

    @Patch('password/change')
    async changePassword() {}
}
