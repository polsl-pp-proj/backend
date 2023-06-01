import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    ValidationPipe,
} from '@nestjs/common';
import { validationConfig } from 'src/configs/validation.config';
import { IProjectService } from 'src/interfaces/project.service.interface';
import { UploadProjectDto } from 'src/modules/project/dtos/upload-project.dto';

@Controller({ path: 'project', version: '1' })
export class ProjectController {
    constructor(private readonly projectService: IProjectService) {}
    @Get()
    async getAllProjects() {}

    @Get(':projectId')
    async getProjectById(@Param('projectId', ParseIntPipe) projectId: number) {}

    @Patch(':projectId')
    async editProjectContent(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Body(new ValidationPipe(validationConfig))
        uploadProjectDto: UploadProjectDto,
    ) {}
}
