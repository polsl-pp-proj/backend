import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectDraft } from './entities/project-draft.entity';
import { ProjectDraftSubmission } from './entities/project-draft-submission.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Project,
            ProjectDraft,
            ProjectDraftSubmission,
        ]),
    ],
    controllers: [],
    providers: [],
})
export class ProjectModule {}
