import { Test, TestingModule } from '@nestjs/testing';
import { OneTimeTokenService } from './one-time-token.service';

describe('OneTimeTokenService', () => {
    let service: OneTimeTokenService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [OneTimeTokenService],
        }).compile();

        service = module.get<OneTimeTokenService>(OneTimeTokenService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
