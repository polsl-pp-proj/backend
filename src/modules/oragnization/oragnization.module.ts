import { Module } from '@nestjs/common';
import { OrganizationController } from './controllers/organization.controller';
import { IOrganizationService } from '../../interfaces/organization.service.interface';
import { OrganizationService } from './services/organization.service';

@Module({
    controllers: [OrganizationController],
    providers: [
        { provide: IOrganizationService, useClass: OrganizationService },
    ],
})
export class OragnizationModule {}
