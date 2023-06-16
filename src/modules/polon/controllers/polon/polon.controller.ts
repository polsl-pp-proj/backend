import { Controller, Get, UseGuards } from '@nestjs/common';
import { PolonService } from '../../services/polon/polon.service';
import { AuthTokenGuard } from 'src/modules/auth/guards/auth-token.guard';

@Controller({ path: 'polon', version: '1' })
export class PolonController {
    constructor(private readonly polonService: PolonService) {}

    @Get('academic-institutions')
    @UseGuards(AuthTokenGuard)
    getAcademicInstitutions() {
        return this.polonService.getAcademicInstitutions();
    }
}
