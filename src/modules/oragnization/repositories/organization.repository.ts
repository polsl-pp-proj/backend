import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import { OrganizationUserRepository } from './organization-user.repository';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import { OrganizationMemberRole } from '../enums/organization-member-role.enum';
import { AddMemberDto } from '../dtos/add-member.dto';

@Injectable()
export class OrganizationRepository extends Repository<Organization> {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly entityManager?: EntityManager,
    ) {
        super(Organization, entityManager ?? dataSource.createEntityManager());
    }

    async createOrganization(
        organizationOwner: AuthTokenPayloadDto,
        createOrganizationDto: CreateOrganizationDto,
    ) {
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

            //Add organization owner to members
            const members = createOrganizationDto.members;
            members.push({
                emailAddress: organizationOwner.emailAddress,
                memberRole: OrganizationMemberRole.Owner,
            });

            const organizationUsersPromise = members.map(async (member) => {
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
            });

            const organizationUsers = await Promise.all(
                organizationUsersPromise,
            );
            await organizationUserRepository.save(organizationUsers);
        });
    }

    async addMembers(organizationId: number, addMemberDto: AddMemberDto[]) {
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

            const organization = await organizationRepository.findOne({
                where: { id: organizationId },
            });

            if (!organization) {
                throw new RecordNotFoundException(
                    'organization_with_id_not_found',
                );
            }

            const organizationUsersPromise = addMemberDto.map(
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
                        organizationId,
                        organization,
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

    async deleteMember(organizationId: number, memberId: number) {
        // To implement
    }
}
