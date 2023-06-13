import { Test, TestingModule } from '@nestjs/testing';
import { PolonService } from './polon.service';

describe('PolonService', () => {
  let service: PolonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PolonService],
    }).compile();

    service = module.get<PolonService>(PolonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
