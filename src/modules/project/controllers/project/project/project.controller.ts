import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { validationConfig } from 'src/configs/validation.config';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { IProjectService } from 'src/interfaces/project.service.interface';
import {
    ProjectDto,
    SimpleProjectDto,
} from 'src/modules/project/dtos/project.dto';
import { UploadProjectDto } from 'src/modules/project/dtos/upload-project.dto';

@Controller({ path: 'project', version: '1' })
export class ProjectController {
    constructor(private readonly projectService: IProjectService) {}
    @Get()
    async getAllProjects(): Promise<SimpleProjectDto[]> {
        return await this.getAllProjects();
    }

    @Get(':projectId')
    async getProjectById(
        @Param('projectId', ParseIntPipe) projectId: number,
    ): Promise<ProjectDto> {
        try {
            return await this.getProjectById(projectId);
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

    @Patch(':projectId')
    async editProjectContent(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Body(new ValidationPipe(validationConfig))
        uploadProjectDto: UploadProjectDto,
    ) {
        try {
            await this.projectService.editProjectContent(
                projectId,
                uploadProjectDto,
            );
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
            throw ex;
        }
    }
}
