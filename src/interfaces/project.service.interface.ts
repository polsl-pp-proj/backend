import {
    ProjectDraftDto,
    SimpleProjectDraftDto,
} from 'src/modules/project/dtos/project-draft.dto';
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
    abstract getAllDrafts(): Promise<SimpleProjectDraftDto[]>;

    /**
     * Returns all drafts belonging to given organization
     *
     * @param organizationId Owner organization ID
     * @returns SimpleProjectDraftDto[] Organization's drafts
     */
    abstract getAllOrganizationsDrafts(
        organizationId: number,
    ): Promise<SimpleProjectDraftDto[]>;

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
        userId: number,
    ): Promise<ProjectDraftDto>;

    /**
     * Creates new project draft and new project draft submission
     *
     * @param uploadProjectDto New project content
     * @param userId user's ID
     */
    abstract createProjectDraft(
        uploadProjectDto: UploadProjectDto,
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
