import { Module } from '@nestjs/common';
import { OrganizationControllerController } from './controllers/organization.controller';
import { IOrganizationService } from '../../interfaces/organization.service.interface';
import { OrganizationService } from './services/organization.service';

@Module({
    controllers: [OrganizationControllerController],
    providers: [
        { provide: IOrganizationService, useClass: OrganizationService },
    ],
})
export class OragnizationModule {}
