import { AddMemberDto } from '../dtos/add-member.dto';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import { OrganizationDto } from '../dtos/organization.dto';

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
        createOrganizationDto: CreateOrganizationDto,
    ): Promise<void>;

    /**
     * Add users to organization
     *
     * @param usersIds Ids of users to add to the organization
     */
    abstract addMembers(addMemberDto: AddMemberDto): Promise<void>;

    /**
     * Deletes memeber from organization
     *
     * @param memberId Id of the organization member to delete
     */
    abstract deleteMember(memberId: number): Promise<void>;
}
