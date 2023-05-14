import { Test, TestingModule } from '@nestjs/testing';
import { SignupMailerService } from './signup-mailer.service';

describe('SignupMailerService', () => {
    let service: SignupMailerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SignupMailerService],
        }).compile();

        service = module.get<SignupMailerService>(SignupMailerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
