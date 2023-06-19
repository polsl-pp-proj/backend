import { Test, TestingModule } from '@nestjs/testing';
import { OpenPositionService } from './open-position.service';

describe('OpenPositionService', () => {
    let service: OpenPositionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [OpenPositionService],
        }).compile();

        service = module.get<OpenPositionService>(OpenPositionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
