import { Test, TestingModule } from '@nestjs/testing';
import { PolonController } from './polon.controller';

describe('PolonController', () => {
    let controller: PolonController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PolonController],
        }).compile();

        controller = module.get<PolonController>(PolonController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
