import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationControllerController } from './organization.controller';

describe('OrganizationControllerController', () => {
    let controller: OrganizationControllerController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrganizationControllerController],
        }).compile();

        controller = module.get<OrganizationControllerController>(
            OrganizationControllerController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
