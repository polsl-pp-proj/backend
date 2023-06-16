import { Test, TestingModule } from '@nestjs/testing';
import { StudentshipMailerService } from './studentship-mailer.service';

describe('StudentshipMailerService', () => {
    let service: StudentshipMailerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [StudentshipMailerService],
        }).compile();

        service = module.get<StudentshipMailerService>(
            StudentshipMailerService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
