import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from '../repositories/organization.repository';
import { OrganizationDto } from '../dtos/organization.dto';
import {
    convertOrganizationToFullOrganizationDto,
    convertOrganizationToOrganizationDto,
} from '../helpers/organization-to-organization-dto.helper';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import { MemberDto } from '../dtos/member.dto';
import { RemoveMembersDto } from '../dtos/remove-members.dto';
import { FullOrganizationDto } from '../dtos/full-organization.dto';

@Injectable()
export class OrganizationService {
    constructor(
        private readonly organizationRepository: OrganizationRepository,
    ) {}

    async getAllOrganizations(): Promise<OrganizationDto[]> {
        const organizations = await this.organizationRepository.find();
        return organizations.map((organization) => {
            return convertOrganizationToOrganizationDto(organization);
        });
    }

    async getOrganizationById(id: number): Promise<OrganizationDto> {
        const organization = await this.organizationRepository.findOne({
            where: { id },
        });

        if (!organization) {
            throw new RecordNotFoundException('organization_with_id_not_found');
        }

        return convertOrganizationToOrganizationDto(organization);
    }

    async getFullOrganizationById(
        userId: number,
        organizationId: number,
    ): Promise<FullOrganizationDto> {
        const organization =
            await this.organizationRepository.getOrganizationWithUsersContainingUser(
                userId,
                organizationId,
            );

        if (!organization) {
            throw new RecordNotFoundException('organization_with_id_not_found');
        }

        return convertOrganizationToFullOrganizationDto(organization);
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
