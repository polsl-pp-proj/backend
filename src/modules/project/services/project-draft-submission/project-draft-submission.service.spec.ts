import { Test, TestingModule } from '@nestjs/testing';
import { ProjectDraftSubmissionService } from './project-draft-submission.service';

describe('ProjectDraftSubmissionService', () => {
  let service: ProjectDraftSubmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectDraftSubmissionService],
    }).compile();

    service = module.get<ProjectDraftSubmissionService>(ProjectDraftSubmissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
