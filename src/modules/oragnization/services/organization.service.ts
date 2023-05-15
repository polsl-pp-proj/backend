import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from '../repositories/organization.repository';
import { OrganizationDto } from '../dtos/organization.dto';
import { convertOrganizationToOrganizationDto } from '../helpers/organization-to-organization-dto.helper';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import { AddMemberDto } from '../dtos/add-member.dto';
import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';

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
        organizationOwner: AuthTokenPayloadDto,
        createOrganizationDto: CreateOrganizationDto,
    ) {
        this.organizationRepository.createOrganization(
            organizationOwner,
            createOrganizationDto,
        );
    }

    async addMembers(
        organizationId: number,
        addMemberDto: AddMemberDto,
    ): Promise<void> {}

    async deleteMember(
        organizationId: number,
        memberId: number,
    ): Promise<void> {}
}
