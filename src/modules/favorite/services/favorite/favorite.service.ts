import { Injectable } from '@nestjs/common';
import { FavoriteProject } from '../../entities/favorite-project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { checkUniqueViolation } from 'src/helpers/check-unique-violation.helper';
import { Repository } from 'typeorm';
import { SimpleProjectDto } from 'src/modules/project/dtos/project.dto';
import { convertProjectToSimpleProjectDto } from 'src/modules/project/helper/project-to-project-dto';

@Injectable()
export class FavoriteService {
    constructor(
        @InjectRepository(FavoriteProject)
        private readonly favoriteProjectRepository: Repository<FavoriteProject>,
    ) {}

    async isUsersFavorite(userId: number, projectId: number): Promise<boolean> {
        const result = await this.favoriteProjectRepository.findOne({
            where: { projectId, userId },
        });
        return !!result;
    }

    async getUsersFavorites(userId: number): Promise<SimpleProjectDto[]> {
        const results = await this.favoriteProjectRepository.find({
            where: {
                userId,
                project: {
                    galleryEntries: { indexPosition: 0 },
                },
            },
            relations: {
                project: {
                    galleryEntries: { asset: true },
                    projectDraft: {
                        ownerOrganization: true,
                    },
                },
            },
        });
        return results.map((favorite) =>
            convertProjectToSimpleProjectDto(favorite.project),
        );
    }

    async getUsersFavoritesIds(userId: number): Promise<number[]> {
        const results = await this.favoriteProjectRepository.find({
            where: {
                userId,
            },
            select: {
                projectId: true,
            },
        });
        return results.map((favorite) => favorite.projectId);
    }

    async addToUsersFavorites(
        userId: number,
        projectId: number,
    ): Promise<void> {
        try {
            await this.favoriteProjectRepository.insert({
                projectId,
                userId,
            });
        } catch (ex) {
            checkUniqueViolation(ex, 'project_already_favorite');
            throw ex;
        }
    }

    async removeFromUsersFavorites(
        userId: number,
        projectId: number,
    ): Promise<void> {
        const result = await this.favoriteProjectRepository.delete({
            userId,
            projectId,
        });
        if (!result.affected) {
            throw new RecordNotFoundException('project_not_favorite');
        }
    }
}
