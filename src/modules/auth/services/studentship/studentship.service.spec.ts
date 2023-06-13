import { Test, TestingModule } from '@nestjs/testing';
import { StudentshipService } from './studentship.service';

describe('StudentshipService', () => {
    let service: StudentshipService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [StudentshipService],
        }).compile();

        service = module.get<StudentshipService>(StudentshipService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
