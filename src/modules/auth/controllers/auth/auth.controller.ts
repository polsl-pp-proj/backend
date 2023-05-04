import { Controller, Delete, Patch, Post } from '@nestjs/common';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
    @Post('login')
    login() {}

    @Patch('refresh')
    refresh() {}

    @Delete('logout')
    logout() {}

    @Delete('logout/all')
    logoutAll() {}

    @Post('password/reset')
    requestPasswordReset() {}

    @Patch('password/reset/:emailAddress/:token')
    confirmPasswordReset() {}

    @Patch('password/change')
    changePassword() {}
}
