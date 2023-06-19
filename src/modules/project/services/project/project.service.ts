import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../repositories/project.repository';
import { SimpleProjectDto } from '../../dtos/project.dto';
import { CreateProjectDto } from '../../dtos/create-project.dto';
import { ProjectDraftRepository } from '../../repositories/project-draft.repository';
import {
    convertProjectDraftToProjectDto,
    convertProjectDraftToSimpleProjectDto,
} from '../../helper/project-draft-to-project-dto';
import {
    convertProjectToProjectDto,
    convertProjectToSimpleProjectDto,
} from '../../helper/project-to-project-dto';
import { IProjectService } from 'src/interfaces/project.service.interface';
import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { UserNotInOrganizationException } from 'src/exceptions/user-not-in-organization.exception';
import { UpdateProjectDto } from '../../dtos/update-project.dto';
import { AssetType } from 'src/modules/asset/enums/asset-type.enum';
import { AssetDto } from 'src/modules/asset/dtos/asset.dto';
import { FavoriteProject } from 'src/modules/favorite/entities/favorite-project.entity';
import { SearchSortBy } from '../../enums/search-sort-by.enum';
import { ProjectDonation } from 'src/modules/donation/entities/project-donation.entity';
import { SearchResultDto } from '../../dtos/search-result.dto';
import { SearchResultsDto } from '../../dtos/search-results.dto';
import { Project } from '../../entities/project.entity';

@Injectable()
export class ProjectService implements IProjectService {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly projectDraftRepository: ProjectDraftRepository,
    ) {}

    async getAllProjects(): Promise<SimpleProjectDto[]> {
        const projects = await this.projectRepository.find({
            where: {
                projectDraft: {
                    galleryEntries: { indexPosition: 0 },
                },
            },
            relations: {
                projectDraft: {
                    ownerOrganization: true,
                    galleryEntries: { asset: true },
                },
            },
        });
        return projects.map((project) =>
            convertProjectToSimpleProjectDto(project),
        );
    }

    async search(
        page: number,
        elementsPerPage: number,
        query?: string,
        category?: number,
        sort?: SearchSortBy,
    ) {
        const projects = this.projectRepository
            .createQueryBuilder('project')
            .addSelect('project.*')
            .leftJoinAndSelect('project.galleryEntries', 'gallery')
            .leftJoinAndSelect('gallery.asset', 'asset')
            .andWhere('gallery.indexPosition = 0')
            .leftJoinAndSelect('project.projectDraft', 'projectDraft')
            .leftJoinAndSelect(
                'projectDraft.ownerOrganization',
                'ownerOrganization',
            )
            .setParameter('query', query)
            .addGroupBy('project.id')
            .addGroupBy(
                `gallery.id, gallery.indexPosition, gallery.projectId, gallery.assetId, gallery.createdAt, gallery.updatedAt`,
            )
            .addGroupBy(
                `asset.id, asset.title, asset.url, asset.assetType, asset.createdAt`,
            )
            .addGroupBy(
                `projectDraft.id, projectDraft.name, projectDraft.shortDescription, projectDraft.description, projectDraft.fundingObjectives, projectDraft.createdAt, projectDraft.updatedAt, projectDraft.ownerOrganizationId`,
            )
            .addGroupBy(
                `ownerOrganization.id, ownerOrganization.name, ownerOrganization.createdAt`,
            )
            .take(elementsPerPage)
            .skip(elementsPerPage * (page - 1));

        if (query !== undefined && query !== '') {
            projects
                .addSelect(
                    `GREATEST(
                        similarity(project.name, :query) * 10,
                        similarity(ownerOrganization.name, :query) * 9,
                        ts_rank_cd(project.searchVector, websearch_to_tsquery(:query), 5) * 8
                    ) * 0.1`,
                    'rank',
                )
                .andWhere(
                    'project.name % :query OR ownerOrganization.name % :query OR project.searchVector @@ websearch_to_tsquery(:query)',
                )
                .addOrderBy('rank', 'DESC', 'NULLS LAST');
        }

        if (category !== undefined) {
            projects
                .leftJoin('project.categories', 'searchProjectCategories')
                .andWhere('searchProjectCategories.categoryId = :categoryId')
                .setParameter('categoryId', category);
        }

        if (sort === SearchSortBy.Funds) {
            projects
                .leftJoin(
                    ProjectDonation,
                    'donation',
                    'donation.projectId = project.id',
                )
                .addSelect(
                    'COALESCE(SUM(donation.amount), 0)',
                    'donation_amount',
                )
                .addOrderBy('donation_amount', 'DESC', 'NULLS LAST');
        } else if (sort === SearchSortBy.Favorites) {
            projects
                .leftJoin(
                    FavoriteProject,
                    'favorite',
                    'favorite.projectId = project.id',
                )
                .addSelect('COUNT(favorite.userId)', 'favorite_count')
                .addOrderBy('favorite_count', 'DESC', 'NULLS LAST');
        } else if (sort === SearchSortBy.Newest) {
            projects.addOrderBy('project.createdAt', 'DESC', 'NULLS LAST');
        }

        const [results, count] = await projects
            .addOrderBy('project.updatedAt', 'DESC', 'NULLS LAST')
            .getManyAndCount();
        let pageCount = Math.ceil(count / elementsPerPage);

        if (!pageCount) {
            pageCount = 1;
        }

        return new SearchResultsDto({
            page,
            pageCount,
            projects: results.map(
                (project) =>
                    new SearchResultDto({
                        ...convertProjectToSimpleProjectDto(project),
                        rank: project.rank,
                        donationAmount: project.donationAmount,
                        favoriteCount: project.favoriteCount,
                    }),
            ),
        });
    }

    async getMostLikedProjects(): Promise<
        (SimpleProjectDto & { likes: number })[]
    > {
        const favorites = await this.projectRepository.manager
            .createQueryBuilder(FavoriteProject, 'favorite')
            .leftJoinAndSelect('favorite.project', 'project')
            .leftJoinAndSelect('project.projectDraft', 'projectDraft')
            .leftJoinAndSelect(
                'projectDraft.ownerOrganization',
                'ownerOrganization',
            )
            .leftJoinAndSelect('project.galleryEntries', 'gallery')
            .leftJoinAndSelect('gallery.asset', 'asset')
            .andWhere('gallery.indexPosition = 0')
            .addGroupBy(
                'favorite.projectId, favorite.userId, favorite.createdAt, project.id, projectDraft.id, ownerOrganization.id, gallery.id, asset.id',
            )
            .addSelect('COALESCE(COUNT(project.id), 0)', 'numberOfLikes')
            .addOrderBy('numberOfLikes', 'DESC', 'NULLS LAST')
            .take(10)
            .getMany();

        return favorites.map((favorite) => ({
            ...convertProjectToSimpleProjectDto(favorite.project),
            likes: (favorite as unknown as Project & { numberOfLikes: number })
                .numberOfLikes,
        }));
    }

    async getNewestProjects(): Promise<SimpleProjectDto[]> {
        const newest = await this.projectRepository.find({
            take: 10,
            order: { createdAt: 'DESC' },
        });

        return newest.map((project) =>
            convertProjectToSimpleProjectDto(project),
        );
    }

    async getAllOrganizationsProjects(organizationId: number) {
        const projects = await this.projectRepository.find({
            where: {
                projectDraft: {
                    ownerOrganizationId: organizationId,
                    galleryEntries: { indexPosition: 0 },
                },
            },
            relations: {
                projectDraft: {
                    ownerOrganization: true,
                    galleryEntries: { asset: true },
                },
            },
        });

        return projects.map((project) =>
            convertProjectToSimpleProjectDto(project),
        );
    }

    async getProjectById(projectId: number) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
            relations: {
                projectDraft: {
                    ownerOrganization: true,
                },
                openPositions: true,
                galleryEntries: { asset: true },
                categories: { category: true },
            },
        });

        return convertProjectToProjectDto(project);
    }

    async getAllDrafts() {
        const drafts = await this.projectDraftRepository.find({
            where: { galleryEntries: { indexPosition: 0 } },
            relations: {
                ownerOrganization: true,
                galleryEntries: { asset: true },
            },
        });

        return drafts.map((draft) => {
            return convertProjectDraftToSimpleProjectDto(draft);
        });
    }

    async getAllOrganizationsDrafts(organizationId: number) {
        const drafts = await this.projectDraftRepository.find({
            where: {
                ownerOrganizationId: organizationId,
                galleryEntries: { indexPosition: 0 },
            },
            relations: {
                ownerOrganization: true,
                galleryEntries: { asset: true },
            },
        });

        return drafts.map((draft) => {
            return convertProjectDraftToSimpleProjectDto(draft);
        });
    }

    async getDraftById(draftId: number, user: AuthTokenPayloadDto) {
        const draft = await this.projectDraftRepository.findOne({
            where: { id: draftId },
            relations: {
                ownerOrganization: true,
                openPositions: true,
                galleryEntries: { asset: true },
                categories: { category: true },
            },
        });

        if (!draft) {
            throw new RecordNotFoundException('draft_with_id_not_found');
        }

        if (
            !user.organizations.some(
                (userOrganization) =>
                    userOrganization.organizationId ===
                    draft.ownerOrganizationId,
            )
        ) {
            throw new UserNotInOrganizationException(
                'user_not_in_organization',
            );
        }

        return convertProjectDraftToProjectDto(draft);
    }

    async createProjectDraft(
        organizationId: number,
        createProjectDto: CreateProjectDto,
        files: Express.Multer.File[],
    ) {
        this.setNewAssetPaths(createProjectDto, files);
        await this.projectDraftRepository.createProjectDraft(
            organizationId,
            createProjectDto,
        );
    }

    async updateProjectDraft(
        userId: number,
        projectDraftId: number,
        updateProjectDto: UpdateProjectDto,
        files: Express.Multer.File[],
    ) {
        this.setNewAssetPaths(updateProjectDto, files);
        await this.projectDraftRepository.updateProjectDraft(
            userId,
            projectDraftId,
            updateProjectDto,
        );
    }

    async editProjectContent(
        projectId: number,
        updateProjectDto: UpdateProjectDto,
        files: Express.Multer.File[],
    ) {
        this.setNewAssetPaths(updateProjectDto, files);
        await this.projectRepository.editProjectContent(
            projectId,
            updateProjectDto,
        );
    }

    private setNewAssetPaths(
        uploadProjectDto: CreateProjectDto | UpdateProjectDto,
        files: Express.Multer.File[],
    ) {
        uploadProjectDto.assets = uploadProjectDto.assets
            .map((asset: number | AssetDto): AssetDto | null => {
                if (typeof asset === 'number') {
                    if (files?.length > asset) {
                        return {
                            title: 'n/a',
                            type: AssetType.Image,
                            url: files[asset].path,
                        };
                    }
                    return null;
                }
                return asset;
            })
            .filter((value) => value !== null);
    }
}
