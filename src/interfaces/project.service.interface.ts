import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import {
    ProjectDto,
    SimpleProjectDto,
} from 'src/modules/project/dtos/project.dto';
import { CreateProjectDto } from 'src/modules/project/dtos/create-project.dto';
import { UpdateProjectDto } from 'src/modules/project/dtos/update-project.dto';
import { SearchSortBy } from 'src/modules/project/enums/search-sort-by.enum';
import { SearchResultsDto } from 'src/modules/project/dtos/search-results.dto';
import { ProjectMessageDto } from 'src/modules/project/dtos/project-message.dto';

export abstract class IProjectService {
    /**
     * Returns all projects
     *
     * @returns ProjectDto[] all projects
     */
    abstract getAllProjects(): Promise<SimpleProjectDto[]>;

    abstract search(
        page: number,
        elementsPerPage: number,
        query?: string,
        category?: number,
        sort?: SearchSortBy,
    ): Promise<SearchResultsDto>;

    abstract getMostLikedProjects(): Promise<SimpleProjectDto[]>;
    abstract getNewestProjects(): Promise<SimpleProjectDto[]>;

    /**
     * Returns all projects belonging to given organization
     *
     * @param organizationId Owner organization ID
     * @returns SimpleProjectDto[] Organization's projects
     */
    abstract getAllOrganizationsProjects(
        organizationId: number,
    ): Promise<SimpleProjectDto[]>;

    /**
     * Returns project with given ID
     * @param projectId ID of the project
     *
     * @returns ProjectDto searched project
     */
    abstract getProjectById(projectId: number): Promise<ProjectDto>;

    abstract sendProjectMessage(
        userId: number,
        projectId: number,
        projectMessageDto: ProjectMessageDto,
    ): Promise<void>;

    /**
     * Returns all projects' drafts
     *
     * @returns ProjectDraftDto[] all projects' drafts
     */
    abstract getAllDrafts(): Promise<SimpleProjectDto[]>;

    /**
     * Returns all drafts belonging to given organization
     *
     * @param organizationId Owner organization ID
     * @returns SimpleProjectDraftDto[] Organization's drafts
     */
    abstract getAllOrganizationsDrafts(
        organizationId: number,
    ): Promise<SimpleProjectDto[]>;

    /**
     * Returns project draft with given ID
     *
     * @param draftId ID of the project draft
     * @param userId User's ID
     *
     * @returns ProjectDraftDto searched project draft
     */
    abstract getDraftById(
        draftId: number,
        user: AuthTokenPayloadDto,
    ): Promise<ProjectDto>;

    /**
     * Creates new project draft and new project draft submission
     *
     * @param uploadProjectDto New project content
     * @param userId user's ID
     */
    abstract createProjectDraft(
        organizationId: number,
        uploadProjectDto: CreateProjectDto,
        files: Express.Multer.File[],
    ): Promise<void>;

    /**
     * Updates project draft with given ID
     * and creates new project draft submission
     *
     * @param projectDraftId ID of the project draft
     * @param uploadProjectDto New project content
     * @param userId User's ID
     */
    abstract updateProjectDraft(
        userId: number,
        projectDraftId: number,
        uploadProjectDto: UpdateProjectDto,
        files: Express.Multer.File[],
    ): Promise<void>;

    /**
     * Changes public project's data.
     *
     * @param projectId ID of project
     * @param uploadProjectDto UploadProjectDto
     */
    abstract editProjectContent(
        projectId: number,
        uploadProjectDto: UpdateProjectDto,
        files: Express.Multer.File[],
    ): Promise<void>;
}
