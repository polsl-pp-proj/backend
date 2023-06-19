import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { OpenPositionForProjectDto } from '../../dtos/open-position-for-project.dto';
import { OpenPositionService } from '../../services/open-position/open-position.service';
import { AuthTokenGuard } from 'src/modules/auth/guards/auth-token.guard';
import { AuthTokenPayload } from 'src/modules/auth/decorators/param/user.decorator';
import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import { validationConfig } from 'src/configs/validation.config';
import { ApplyForOpenPositionDto } from '../../dtos/apply-for-open-position.dto';

@Controller({ path: 'project/open-position', version: '1' })
export class OpenPositionController {
    constructor(private readonly openPositionService: OpenPositionService) {}

    @Get('organization/:organizationId')
    async getAllOrganizationsOpenPositions(
        @Param('organizationId', ParseIntPipe) organizationId: number,
    ): Promise<OpenPositionForProjectDto[]> {
        return await this.openPositionService.getOpenPositionsForOrganization(
            organizationId,
        );
    }

    @Post('apply/:openPositionId')
    @UseGuards(AuthTokenGuard)
    async applyForOpenPosition(
        @AuthTokenPayload() user: AuthTokenPayloadDto,
        @Param('openPositionId', ParseIntPipe) openPositionId: number,
        @Body(new ValidationPipe(validationConfig))
        applyForOpenPositionDto: ApplyForOpenPositionDto,
    ): Promise<void> {
        if (user.isVerifiedStudent) {
            await this.openPositionService.applyForOpenPosition(
                user.userId,
                openPositionId,
                applyForOpenPositionDto.candidateSummary,
            );
            return;
        }
        throw new ForbiddenException('user_not_verified_student');
    }
}
