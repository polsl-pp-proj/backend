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
import { ProjectController } from './controllers/project/project.controller';
import { ProjectDraftController } from './controllers/project-draft/project-draft.controller';
import { ProjectDraftSubmissionController } from './controllers/project-draft-submission/project-draft-submission.controller';
import { ProjectDraftOpenPosition } from './entities/project-draft-open-position.entity';
import { ProjectOpenPosition } from './entities/project-open-position.entity';
import { ProjectDraftOpenPositionRepository } from './repositories/project-draft-open-position.repository';
import { ProjectOpenPositionRepository } from './repositories/project-open-position.repository';
import { CategoryModule } from '../category/category.module';
import { ProjectCategory } from './entities/project-category.entity';
import { ProjectDraftCategory } from './entities/project-draft-category.entity';
import { ProjectCategoryRepository } from './repositories/project-category.repository';
import { ProjectDraftCategoryRepository } from './repositories/project-draft-category.repository';
import { OpenPositionController } from './controllers/open-position/open-position.controller';
import { OpenPositionService } from './services/open-position/open-position.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
    imports: [
        UserModule,
        OrganizationModule,
        TypeOrmModule.forFeature([
            Project,
            ProjectOpenPosition,
            ProjectCategory,
            ProjectDraft,
            ProjectDraftOpenPosition,
            ProjectDraftCategory,
            ProjectDraftSubmission,
        ]),
        CategoryModule,
        NotificationModule,
    ],
    controllers: [
        ProjectController,
        ProjectDraftController,
        ProjectDraftSubmissionController,
        OpenPositionController,
    ],
    providers: [
        { provide: IProjectService, useClass: ProjectService },
        {
            provide: IProjectDraftSubmissionService,
            useClass: ProjectDraftSubmission,
        },
        ProjectRepository,
        ProjectOpenPositionRepository,
        ProjectCategoryRepository,
        ProjectDraftRepository,
        ProjectDraftOpenPositionRepository,
        ProjectDraftCategoryRepository,
        ProjectDraftSubmissionRepository,
        OpenPositionService,
    ],
})
export class ProjectModule {}
