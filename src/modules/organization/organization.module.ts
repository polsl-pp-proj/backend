import { Module } from '@nestjs/common';
import { OrganizationController } from './controllers/organization.controller';
import { IOrganizationService } from '../../interfaces/organization.service.interface';
import { OrganizationService } from './services/organization.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationUser } from './entities/organization-user.entity';
import { OrganizationRepository } from './repositories/organization.repository';
import { OrganizationUserRepository } from './repositories/organization-user.repository';

@Module({
    controllers: [OrganizationController],
    providers: [
        { provide: IOrganizationService, useClass: OrganizationService },
        OrganizationRepository,
        OrganizationUserRepository,
    ],
    imports: [TypeOrmModule.forFeature([Organization, OrganizationUser])],
})
export class OrganizationModule {}
