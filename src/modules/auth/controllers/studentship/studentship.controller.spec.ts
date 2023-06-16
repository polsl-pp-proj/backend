import { Test, TestingModule } from '@nestjs/testing';
import { StudentshipController } from './studentship.controller';

describe('StudentshipController', () => {
    let controller: StudentshipController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StudentshipController],
        }).compile();

        controller = module.get<StudentshipController>(StudentshipController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
