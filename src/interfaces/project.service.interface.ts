import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import {
    ProjectDto,
    SimpleProjectDto,
} from 'src/modules/project/dtos/project.dto';
import { UploadProjectDto } from 'src/modules/project/dtos/upload-project.dto';

export abstract class IProjectService {
    /**
     * Returns all projects
     *
     * @returns ProjectDto[] all projects
     */
    abstract getAllProjects(): Promise<SimpleProjectDto[]>;

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
        user: AuthTokenPayloadDto,
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
        uploadProjectDto: UploadProjectDto,
        organizationId: number,
        userId: number,
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
        projectDraftId: number,
        uploadProjectDto: UploadProjectDto,
        organizationId: number,
        userId: number,
    ): Promise<void>;

    /**
     * Changes public project's data.
     *
     * @param projectId ID of project
     * @param uploadProjectDto UploadProjectDto
     */
    abstract editProjectContent(
        projectId: number,
        uploadProjectDto: UploadProjectDto,
    ): Promise<void>;
}
