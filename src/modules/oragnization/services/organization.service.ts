import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from '../repositories/organization.repository';
import { OrganizationDto } from '../dtos/organization.dto';
import { convertOrganizationToOrganizationDto } from '../helpers/organization-to-organization-dto.helper';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import { MemberDto } from '../dtos/member.dto';
import { RemoveMembersDto } from '../dtos/remove-members.dto';

@Injectable()
export class OrganizationService {
    constructor(
        private readonly organizationRepository: OrganizationRepository,
    ) {}

    async getAllOrganizations(): Promise<OrganizationDto[]> {
        const organizations = await this.organizationRepository.find({
            relations: { organizationUsers: { user: true } },
        });
        return organizations.map((organization) => {
            return convertOrganizationToOrganizationDto(organization);
        });
    }

    async getOrgnizationById(id: number): Promise<OrganizationDto> {
        const organization = await this.organizationRepository.findOne({
            relations: { organizationUsers: { user: true } },
            where: { id },
        });

        if (!organization) {
            throw new RecordNotFoundException('organization_with_id_not_found');
        }

        return convertOrganizationToOrganizationDto(organization);
    }

    async createOrganization(
        organizationOwnerId: number,
        createOrganizationDto: CreateOrganizationDto,
    ) {
        await this.organizationRepository.createOrganization(
            organizationOwnerId,
            createOrganizationDto,
        );
    }

    async addMembers(
        userId: number,
        organizationId: number,
        addMemberDto: MemberDto[],
    ): Promise<void> {
        await this.organizationRepository.addMembers(
            userId,
            organizationId,
            addMemberDto,
        );
    }

    async removeMembers(
        userId: number,
        organizationId: number,
        removeMembersDto: RemoveMembersDto,
    ): Promise<void> {
        await this.organizationRepository.removeMembers(
            userId,
            organizationId,
            removeMembersDto.memberIds,
        );
    }
}
