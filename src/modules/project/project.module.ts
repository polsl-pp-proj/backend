import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectDraft } from './entities/project-draft.entity';
import { ProjectDraftSubmission } from './entities/project-draft-submission.entity';
import { UserModule } from '../user/user.module';
import { OrganizationModule } from '../organization/organization.module';
import { ProjectService } from './services/project/project.service';
import { IProjectService } from 'src/interfaces/project.service.interface';
import { IProjectDraftSubmissionService } from 'src/interfaces/project-draft-submission.service.interface';
import { ProjectDraftRepository } from './repositories/project-draft.repository';
import { ProjectDraftSubmissionRepository } from './repositories/project-draft-submission.repository';
import { ProjectRepository } from './repositories/project.repository';
import { ProjectController } from './controllers/project/project/project.controller';
import { ProjectDraftController } from './controllers/project-draft/project-draft/project-draft.controller';
import { ProjectDraftSubmissionController } from './controllers/project-draft-submission/project-draft-submission/project-draft-submission.controller';

@Module({
    imports: [
        UserModule,
        OrganizationModule,
        TypeOrmModule.forFeature([
            Project,
            ProjectDraft,
            ProjectDraftSubmission,
        ]),
    ],
    controllers: [
        ProjectController,
        ProjectDraftController,
        ProjectDraftSubmissionController,
    ],
    providers: [
        { provide: IProjectService, useClass: ProjectService },
        {
            provide: IProjectDraftSubmissionService,
            useClass: ProjectDraftSubmission,
        },
        ProjectDraftRepository,
        ProjectDraftSubmissionRepository,
        ProjectRepository,
    ],
})
export class ProjectModule {}
