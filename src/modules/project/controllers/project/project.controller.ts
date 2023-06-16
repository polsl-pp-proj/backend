import {
    Body,
    Controller,
    Get,
    NotFoundException,
    ForbiddenException,
    Param,
    ParseIntPipe,
    Patch,
    UseGuards,
    ValidationPipe,
    UploadedFiles,
    UseInterceptors,
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
import { UserRole } from 'src/modules/user/enums/user-role.enum';
import { UpdateProjectDto } from 'src/modules/project/dtos/update-project.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { filesInterceptorConfig } from '../../configs/files-interceptor.config';

@Controller({ path: 'project', version: '1' })
export class ProjectController {
    constructor(private readonly projectService: IProjectService) {}
    @Get()
    async getAllProjects(): Promise<SimpleProjectDto[]> {
        return await this.projectService.getAllProjects();
    }

    @Get(':projectId')
    async getProjectById(
        @Param('projectId', ParseIntPipe) projectId: number,
    ): Promise<ProjectDto> {
        try {
            return await this.projectService.getProjectById(projectId);
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
            throw ex;
        }
    }

    @Get('organization/:organizationId')
    async getAllOrganizationsProjects(
        @Param('organizationId', ParseIntPipe) organizationId: number,
    ): Promise<SimpleProjectDto[]> {
        return await this.projectService.getAllOrganizationsProjects(
            organizationId,
        );
    }

    @UseInterceptors(
        FilesInterceptor('fileAssets', undefined, filesInterceptorConfig),
    )
    @Patch(':projectId')
    @UseGuards(AuthTokenGuard)
    async editProjectContent(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Body(new ValidationPipe(validationConfig))
        updateProjectDto: UpdateProjectDto,
        @AuthTokenPayload() user: AuthTokenPayloadDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        if (user.role !== UserRole.Administrator) {
            throw new ForbiddenException('not_an_administrator');
        }
        try {
            await this.projectService.editProjectContent(
                projectId,
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
