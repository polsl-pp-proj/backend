import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import { OrganizationUserRepository } from './organization-user.repository';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';

@Injectable()
export class OrganizationRepository extends Repository<Organization> {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly entityManager?: EntityManager,
    ) {
        super(Organization, entityManager ?? dataSource.createEntityManager());
    }

    async createOrganization(createOrganizationDto: CreateOrganizationDto) {
        await this.entityManager.transaction(async (entityManager) => {
            const organizationRepository = new OrganizationRepository(
                entityManager.connection,
                entityManager,
            );
            const organizationUserRepository = new OrganizationUserRepository(
                entityManager.connection,
                entityManager,
            );
            const userRepository = new UserRepository(
                entityManager.connection,
                entityManager,
            );

            const newOrganization = organizationRepository.create({
                name: createOrganizationDto.name,
            });
            await organizationRepository.save(newOrganization);

            const organizationUsersPromise = createOrganizationDto.members.map(
                async (member) => {
                    const user = await userRepository.findOne({
                        where: { emailAddress: member.emailAddress },
                    });

                    if (!user) {
                        throw new RecordNotFoundException(
                            'user_with_email_address_not_found',
                        );
                    }

                    return organizationUserRepository.create({
                        organizationId: newOrganization.id,
                        organization: newOrganization,
                        userId: user.id,
                        user,
                    });
                },
            );

            const organizationUsers = await Promise.all(
                organizationUsersPromise,
            );
            await organizationUserRepository.save(organizationUsers);
        });
    }
}
