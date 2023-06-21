import { Test, TestingModule } from '@nestjs/testing';
import { OpenPositionController } from './open-position.controller';

describe('OpenPositionController', () => {
  let controller: OpenPositionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenPositionController],
    }).compile();

    controller = module.get<OpenPositionController>(OpenPositionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
