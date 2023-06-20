import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { IProjectDraftSubmissionService } from 'src/interfaces/project-draft-submission.service.interface';
import { AuthTokenPayload } from 'src/modules/auth/decorators/param/user.decorator';
import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import { AuthTokenGuard } from 'src/modules/auth/guards/auth-token.guard';
import { ProjectDto } from 'src/modules/project/dtos/project.dto';
import { SubmissionDto } from 'src/modules/project/dtos/submission.dto';
import { UserRole } from 'src/modules/user/enums/user-role.enum';
import { ParseDatePipe } from 'src/pipes/parse-date.pipe';

@Controller({ path: 'project/draft/submission', version: '1' })
export class ProjectDraftSubmissionController {
    constructor(
        private readonly projectDraftSubmissionService: IProjectDraftSubmissionService,
    ) {}

    @Get()
    @UseGuards(AuthTokenGuard)
    async getSubmissions(
        @AuthTokenPayload() user: AuthTokenPayloadDto,
    ): Promise<SubmissionDto[]> {
        if (user.role === UserRole.BasicUser) {
            throw new ForbiddenException('not_moderator_or_admin');
        }
        return await this.projectDraftSubmissionService.getSubmissions();
    }

    @Get(':submissionId')
    @UseGuards(AuthTokenGuard)
    async getSubmission(
        @Param('submissionId', ParseIntPipe) submissionId: number,
        @AuthTokenPayload() user: AuthTokenPayloadDto,
    ): Promise<ProjectDto> {
        if (user.role === UserRole.BasicUser) {
            throw new ForbiddenException('not_moderator_or_admin');
        }
        try {
            return await this.projectDraftSubmissionService.getSubmissionById(
                submissionId,
            );
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
        }
    }

    @Patch(':submissionId/publish')
    @UseGuards(AuthTokenGuard)
    async publishSubmission(
        @Param('submissionId', ParseIntPipe) submissionId: number,
        @Body('draftLastModified', ParseDatePipe) draftLastModified: Date,
        @AuthTokenPayload() user: AuthTokenPayloadDto,
    ): Promise<void> {
        if (user.role === UserRole.BasicUser) {
            throw new ForbiddenException('not_moderator_or_admin');
        }
        await this.projectDraftSubmissionService.publishSubmission(
            submissionId,
            draftLastModified,
        );
    }

    @Patch(':submissionId/reject')
    @UseGuards(AuthTokenGuard)
    async rejectSubmission(
        @Param('submissionId', ParseIntPipe) submissionId: number,
        @Body('draftLastModified', ParseDatePipe) draftLastModified: Date,
        @Body('reason') reason: string,
        @AuthTokenPayload() user: AuthTokenPayloadDto,
    ): Promise<void> {
        if (user.role === UserRole.BasicUser) {
            throw new ForbiddenException('not_moderator_or_admin');
        }
        await this.projectDraftSubmissionService.rejectSubmission(
            submissionId,
            draftLastModified,
            reason,
        );
    }
}
