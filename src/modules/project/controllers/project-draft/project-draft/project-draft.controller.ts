import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { validationConfig } from 'src/configs/validation.config';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { IProjectService } from 'src/interfaces/project.service.interface';
import { AuthTokenPayload } from 'src/modules/auth/decorators/param/user.decorator';
import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import { AuthTokenGuard } from 'src/modules/auth/guards/auth-token.guard';
import {
    ProjectDto,
    SimpleProjectDto,
} from 'src/modules/project/dtos/project.dto';
import { UploadProjectDto } from 'src/modules/project/dtos/upload-project.dto';

@Controller({ path: 'project/draft', version: '1' })
export class ProjectDraftController {
    constructor(private readonly projectService: IProjectService) {}

    @Get('organization/:organizationId')
    @UseGuards(AuthTokenGuard)
    async getAllOrganizationDrafts(
        @Param('organizationId', ParseIntPipe) organizationId: number,
        @AuthTokenPayload() user: AuthTokenPayloadDto,
    ): Promise<SimpleProjectDto[]> {
        return await this.projectService.getAllOrganizationsDrafts(
            organizationId,
            user,
        );
    }

    @Get(':draftId')
    @UseGuards(AuthTokenGuard)
    async getProjectDraft(
        @Param('draftId', ParseIntPipe) draftId: number,
        @AuthTokenPayload() user: AuthTokenPayloadDto,
    ): Promise<ProjectDto> {
        try {
            return await this.projectService.getDraftById(draftId, user);
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
            throw ex;
        }
    }

    @Post('organization/:organizationId')
    @UseGuards(AuthTokenGuard)
    async createProjectDraft(
        @Param('organizationId', ParseIntPipe) organizationId: number,
        @Body(new ValidationPipe(validationConfig))
        uploadProjectDto: UploadProjectDto,
        @AuthTokenPayload() user: AuthTokenPayloadDto,
    ): Promise<void> {
        await this.projectService.createProjectDraft(
            uploadProjectDto,
            organizationId,
            user.userId,
        );
    }

    @Patch(':draftId/organization/:organizationId')
    @UseGuards(AuthTokenGuard)
    async editProjectDraft(
        @Param('draftId', ParseIntPipe) draftId: number,
        @Param('organizationId', ParseIntPipe) organizationId: number,
        @Body(new ValidationPipe(validationConfig))
        uploadProjectDto: UploadProjectDto,
        @AuthTokenPayload() user: AuthTokenPayloadDto,
    ): Promise<void> {
        try {
            await this.projectService.updateProjectDraft(
                draftId,
                uploadProjectDto,
                organizationId,
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
