import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import { MemberDto } from '../modules/oragnization/dtos/member.dto';
import { CreateOrganizationDto } from '../modules/oragnization/dtos/create-organization.dto';
import { OrganizationDto } from '../modules/oragnization/dtos/organization.dto';
import { AddMembersDto } from '../modules/oragnization/dtos/add-members.dto';
import { RemoveMembersDto } from '../modules/oragnization/dtos/remove-members.dto';

export abstract class IOrganizationService {
    /**
     * Returns all organizations
     *
     * @returns OrganizatonDto[] All organizations
     */
    abstract getAllOrganizations(): Promise<OrganizationDto[]>;

    /**
     * Returns organization with given id
     *
     * @param id Organization id
     * @returns OrganizatonDto
     */
    abstract getOrganizationById(id: number): Promise<OrganizationDto>;

    /**
     * Creates new organization
     *
     * @param createOrganizationDto New organization data
     */
    abstract createOrganization(
        organizationOwnerId: number,
        createOrganizationDto: CreateOrganizationDto,
    ): Promise<void>;

    /**
     * Add users to organization
     *
     * @param usersIds Ids of users to add to the organization
     */
    abstract addMembers(
        userId: number,
        organizationId: number,
        addMembersDto: AddMembersDto,
    ): Promise<void>;

    /**
     * Deletes memeber from organization
     *
     * @param memberId Id of the organization member to delete
     */
    abstract removeMembers(
        userId: number,
        organizationId: number,
        removeMembersDto: RemoveMembersDto,
    ): Promise<void>;
}
