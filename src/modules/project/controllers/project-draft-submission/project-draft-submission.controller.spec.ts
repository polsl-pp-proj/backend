import { Test, TestingModule } from '@nestjs/testing';
import { ProjectDraftSubmissionController } from './project-draft-submission.controller';

describe('ProjectDraftSubmissionController', () => {
  let controller: ProjectDraftSubmissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectDraftSubmissionController],
    }).compile();

    controller = module.get<ProjectDraftSubmissionController>(ProjectDraftSubmissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
