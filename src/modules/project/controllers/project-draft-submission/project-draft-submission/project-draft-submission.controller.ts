import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
} from '@nestjs/common';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { IProjectDraftSubmissionService } from 'src/interfaces/project-draft-submission.service.interface';
import { SubmissionDto } from 'src/modules/project/dtos/submission.dto';
import { ParseDatePipe } from 'src/pipes/parse-date.pipe';

@Controller({ path: 'project/draft/submission', version: '1' })
export class ProjectDraftSubmissionController {
    constructor(
        private readonly projectDraftSubmissionService: IProjectDraftSubmissionService,
    ) {}

    @Get()
    async getSubmissions(): Promise<SubmissionDto[]> {
        return await this.projectDraftSubmissionService.getSubmissions();
    }

    @Get(':submissionId')
    async getSubmission(
        @Param('submissionId', ParseIntPipe) submissionId: number,
    ): Promise<SubmissionDto> {
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
    async publishChangeSubmission(
        @Param('submissionId', ParseIntPipe) submissionId: number,
        @Body('draftLastModified', ParseDatePipe) draftLastModified: Date,
    ): Promise<void> {
        await this.projectDraftSubmissionService.publishSubmission(
            submissionId,
            draftLastModified,
        );
    }

    @Patch(':submissionId/reject')
    async rejectSubmission(
        @Param('submissionId', ParseIntPipe) submissionId: number,
        @Body('draftLastModified', ParseDatePipe) draftLastModified: Date,
        @Body('reason') reason: string,
    ): Promise<void> {
        await this.projectDraftSubmissionService.rejectSubmission(
            submissionId,
            draftLastModified,
            reason,
        );
    }
}
