import { Controller, Get } from '@nestjs/common';
import { PolonService } from '../../services/polon/polon.service';

@Controller({ path: 'polon', version: '1' })
export class PolonController {
    constructor(private readonly polonService: PolonService) {}

    @Get('academic-institutions')
    getAcademicInstitutions() {
        return this.polonService.getAcademicInstitutions();
    }
}
