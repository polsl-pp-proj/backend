import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import { OrganizationUserRepository } from './organization-user.repository';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { OrganizationMemberRole } from '../enums/organization-member-role.enum';
import { MemberDto } from '../dtos/member.dto';

@Injectable()
export class OrganizationRepository extends Repository<Organization> {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly entityManager?: EntityManager,
    ) {
        super(Organization, entityManager ?? dataSource.createEntityManager());
    }

    async createOrganization(
        organizationOwnerId: number,
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

            const newOrganization = organizationRepository.create({
                name: createOrganizationDto.name,
            });
            await organizationRepository.save(newOrganization);

            const ownerMember = organizationUserRepository.create({
                organizationId: newOrganization.id,
                organization: newOrganization,
                userId: organizationOwnerId,
                user: { id: organizationOwnerId },
                role: OrganizationMemberRole.Owner,
            });
            await organizationUserRepository.save(ownerMember);
        });
    }

    async addMembers(
        userId: number,
        organizationId: number,
        addMemberDto: MemberDto[],
    ) {
        await this.entityManager.transaction(async (entityManager) => {
            const organizationUserRepository = new OrganizationUserRepository(
                entityManager.connection,
                entityManager,
            );
            const userRepository = new UserRepository(
                entityManager.connection,
                entityManager,
            );

            const organizationOwnerMember =
                await organizationUserRepository.findOne({
                    where: {
                        organizationId,
                        userId,
                        role: OrganizationMemberRole.Owner,
                    },
                    relations: { organization: true },
                });

            if (!organizationOwnerMember) {
                throw new RecordNotFoundException(
                    'organization_with_owner_and_id_not_found',
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
                        organization: organizationOwnerMember.organization,
                        userId: user.id,
                        user,
                        role: OrganizationMemberRole.Member,
                    });
                },
            );

            const organizationUsers = await Promise.all(
                organizationUsersPromise,
            );
            await organizationUserRepository.save(organizationUsers);
        });
    }

    async removeMembers(
        userId: number,
        organizationId: number,
        memberIds: number[],
    ) {
        const organizationUserRepository = new OrganizationUserRepository(
            this.entityManager.connection,
            this.entityManager,
        );

        const organizationOwnerMember =
            await organizationUserRepository.findOne({
                where: {
                    organizationId,
                    userId,
                    role: OrganizationMemberRole.Owner,
                },
                relations: { organization: true },
            });

        if (!organizationOwnerMember) {
            throw new RecordNotFoundException(
                'organization_with_owner_and_id_not_found',
            );
        }

        const deleteMembersPromise = memberIds.map((memberId) => {
            return organizationUserRepository.delete({
                userId: memberId,
                organizationId,
            });
        });

        await Promise.all(deleteMembersPromise);
    }

    async getOrganizationWithUsersContainingUser(
        userId: number,
        organizationId: number,
    ) {
        const organizationUserRepository = new OrganizationUserRepository(
            this.dataSource,
            this.entityManager,
        );
        const organizationMember = await organizationUserRepository.findOne({
            where: { userId, organizationId },
            relations: { organization: { organizationUsers: true } },
        });
        return organizationMember?.organization;
    }
}
