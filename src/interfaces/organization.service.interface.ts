import { CreateOrganizationDto } from '../modules/organization/dtos/create-organization.dto';
import { OrganizationDto } from '../modules/organization/dtos/organization.dto';
import { AddMembersDto } from '../modules/organization/dtos/add-members.dto';
import { RemoveMembersDto } from '../modules/organization/dtos/remove-members.dto';
import { FullOrganizationDto } from 'src/modules/organization/dtos/full-organization.dto';
import { OrganizationMemberDto } from 'src/modules/organization/dtos/organization-member.dto';

export abstract class IOrganizationService {
    /**
     * Returns all organizations
     *
     * @returns OrganizationDto[] All organizations
     */
    abstract getAllOrganizations(): Promise<OrganizationDto[]>;

    /**
     * Returns organization containing requesting user
     *
     * @returns OrganizationDto[] Organizations, user is member of
     */
    abstract getOwnOrganizations(userId: number): Promise<OrganizationDto[]>;

    /**
     * Returns organization with given id with it's members
     *
     * @param userId id of requesting user
     * @param organizationId id of organization
     */
    abstract getFullOrganizationById(
        userId: number,
        organizationId: number,
    ): Promise<FullOrganizationDto>;

    /**
     * Returns organization with given id
     *
     * @param id Organization id
     * @returns OrganizationDto
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

    abstract getOrganizationMembers(
        organizationId: number,
    ): Promise<OrganizationMemberDto[]>;

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
     * Deletes member from organization
     *
     * @param memberId Id of the organization member to delete
     */
    abstract removeMembers(
        userId: number,
        organizationId: number,
        removeMembersDto: RemoveMembersDto,
    ): Promise<void>;
}
