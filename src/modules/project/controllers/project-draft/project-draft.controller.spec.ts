import { Test, TestingModule } from '@nestjs/testing';
import { ProjectDraftController } from './project-draft.controller';

describe('ProjectDraftController', () => {
  let controller: ProjectDraftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectDraftController],
    }).compile();

    controller = module.get<ProjectDraftController>(ProjectDraftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
