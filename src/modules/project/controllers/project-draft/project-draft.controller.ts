import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
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
import { CreateProjectDto } from 'src/modules/project/dtos/create-project.dto';
import { UpdateProjectDto } from 'src/modules/project/dtos/update-project.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { filesInterceptorConfig } from '../../configs/files-interceptor.config';

@Controller({ path: 'project/draft', version: '1' })
export class ProjectDraftController {
    constructor(private readonly projectService: IProjectService) {}

    @Get('organization/:organizationId')
    @UseGuards(AuthTokenGuard)
    async getAllOrganizationDrafts(
        @Param('organizationId', ParseIntPipe) organizationId: number,
        @AuthTokenPayload() user: AuthTokenPayloadDto,
    ): Promise<SimpleProjectDto[]> {
        if (
            !user.organizations.some(
                (userOrganization) =>
                    userOrganization.organizationId === organizationId,
            )
        ) {
            throw new ForbiddenException('user_not_in_organization');
        }
        return await this.projectService.getAllOrganizationsDrafts(
            organizationId,
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

    @UseInterceptors(
        FilesInterceptor('fileAssets', undefined, filesInterceptorConfig),
    )
    @Post('organization/:organizationId')
    @UseGuards(AuthTokenGuard)
    async createProjectDraft(
        @Param('organizationId', ParseIntPipe) organizationId: number,
        @Body(new ValidationPipe(validationConfig))
        uploadProjectDto: CreateProjectDto,
        @AuthTokenPayload() user: AuthTokenPayloadDto,
        @UploadedFiles() files: Express.Multer.File[],
    ): Promise<void> {
        if (
            !user.organizations.some(
                (userOrganization) =>
                    userOrganization.organizationId === organizationId,
            )
        ) {
            throw new ForbiddenException('user_not_in_organization');
        }
        await this.projectService.createProjectDraft(
            organizationId,
            uploadProjectDto,
            files,
        );
    }

    @UseInterceptors(
        FilesInterceptor('fileAssets', undefined, filesInterceptorConfig),
    )
    @Patch(':draftId')
    @UseGuards(AuthTokenGuard)
    async editProjectDraft(
        @Param('draftId', ParseIntPipe) draftId: number,
        @Body(new ValidationPipe(validationConfig))
        updateProjectDto: UpdateProjectDto,
        @AuthTokenPayload() user: AuthTokenPayloadDto,
        @UploadedFiles() files: Express.Multer.File[],
    ): Promise<void> {
        try {
            await this.projectService.updateProjectDraft(
                user.userId,
                draftId,
                updateProjectDto,
                files,
            );
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
            throw ex;
        }
    }
}
