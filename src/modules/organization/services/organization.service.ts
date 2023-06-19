import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from '../repositories/organization.repository';
import { OrganizationDto } from '../dtos/organization.dto';
import {
    convertOrganizationToFullOrganizationDto,
    convertOrganizationToOrganizationDto,
} from '../helpers/organization-to-organization-dto.helper';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import { RemoveMembersDto } from '../dtos/remove-members.dto';
import { FullOrganizationDto } from '../dtos/full-organization.dto';
import { IOrganizationService } from 'src/interfaces/organization.service.interface';
import { AddMembersDto } from '../dtos/add-members.dto';
import { OrganizationMemberDto } from '../dtos/organization-member.dto';
import { OrganizationUserRepository } from '../repositories/organization-user.repository';
import { convertOrganizationUserToOrganizationMemberDto } from '../helpers/organization-user-to-organization-member-dto.helper';

@Injectable()
export class OrganizationService implements IOrganizationService {
    constructor(
        private readonly organizationRepository: OrganizationRepository,
        private readonly organizationUserRepository: OrganizationUserRepository,
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

    async getOwnOrganizations(userId: number): Promise<OrganizationDto[]> {
        return (
            await this.organizationRepository.getOrganizationsContainingUser(
                userId,
            )
        ).map((organization) =>
            convertOrganizationToOrganizationDto(organization),
        );
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

    async getOrganizationMembers(
        organizationId: number,
    ): Promise<OrganizationMemberDto[]> {
        const organizationUsers = await this.organizationUserRepository.find({
            where: { organizationId },
            relations: { user: true },
        });

        return organizationUsers.map((orgUser) =>
            convertOrganizationUserToOrganizationMemberDto(orgUser),
        );
    }

    async addMembers(
        userId: number,
        organizationId: number,
        addMemberDto: AddMembersDto,
    ): Promise<void> {
        await this.organizationRepository.addMembers(
            userId,
            organizationId,
            addMemberDto.memebers,
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
