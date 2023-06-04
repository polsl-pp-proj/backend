import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    ValidationPipe,
} from '@nestjs/common';
import { validationConfig } from 'src/configs/validation.config';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { IProjectService } from 'src/interfaces/project.service.interface';
import { AuthTokenPayload } from 'src/modules/auth/decorators/param/user.decorator';
import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import {
    ProjectDraftDto,
    SimpleProjectDraftDto,
} from 'src/modules/project/dtos/project-draft.dto';
import { UploadProjectDto } from 'src/modules/project/dtos/upload-project.dto';

@Controller({ path: 'project/draft', version: '1' })
export class ProjectDraftController {
    constructor(private readonly projectService: IProjectService) {}

    @Get('organization/:organizationId')
    async getAllOrganizationDrafts(
        @Param('organizationId', ParseIntPipe) organizationId: number,
    ): Promise<SimpleProjectDraftDto[]> {
        return await this.projectService.getAllOrganizationsDrafts(
            organizationId,
        );
    }

    @Get(':draftId')
    async getProjectDraft(
        @Param('draftId', ParseIntPipe) draftId: number,
        @AuthTokenPayload() user: AuthTokenPayloadDto,
    ): Promise<ProjectDraftDto> {
        try {
            return await this.projectService.getDraftById(draftId, user.userId);
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
            throw ex;
        }
    }

    @Post()
    async createProjectDraft(
        @Body(new ValidationPipe(validationConfig))
        uploadProjectDto: UploadProjectDto,
        @AuthTokenPayload() user: AuthTokenPayloadDto,
    ): Promise<void> {
        await this.projectService.createProjectDraft(
            uploadProjectDto,
            user.userId,
        );
    }

    @Patch(':draftId')
    async editProjectDraft(
        @Param('draftId', ParseIntPipe) draftId: number,
        @Body(new ValidationPipe(validationConfig))
        uploadProjectDto: UploadProjectDto,
        @AuthTokenPayload() user: AuthTokenPayloadDto,
    ): Promise<void> {
        try {
            await this.projectService.updateProjectDraft(
                draftId,
                uploadProjectDto,
                user.userId,
            );
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
            throw ex;
        }
    }
}
