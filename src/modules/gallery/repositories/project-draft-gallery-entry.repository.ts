import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Asset } from '../../asset/entities/asset.entity';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { ProjectDraftGalleryEntry } from '../entities/project-draft-gallery-entry.entity';

@Injectable()
export class ProjectDraftGalleryEntryRepository extends Repository<ProjectDraftGalleryEntry> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        entityManager?: EntityManager,
    ) {
        super(
            ProjectDraftGalleryEntry,
            entityManager ?? dataSource.createEntityManager(),
        );
    }

    async createGalleryEntry(
        projectDraftId: number,
        index: number,
        asset: Asset,
    ) {
        const galleryEntry = this.create({
            projectDraftId,
            projectDraft: { id: projectDraftId },
            asset: asset,
            assetId: asset.id,
            indexPosition: index,
        });
        return await this.save(galleryEntry);
    }

    async createOrUpdateGalleryEntry(
        projectDraftId: number,
        index: number,
        asset: Asset,
    ) {
        return await this.manager.transaction(async (manager) => {
            const projectDraftGalleryRepository =
                new ProjectDraftGalleryEntryRepository(
                    manager.connection,
                    manager,
                );

            const galleryEntry = await projectDraftGalleryRepository.findOne({
                where: { projectDraftId, assetId: asset.id },
            });

            if (galleryEntry) {
                if (galleryEntry.indexPosition !== index) {
                    galleryEntry.indexPosition = index;
                    await projectDraftGalleryRepository.save(galleryEntry, {
                        reload: true,
                    });
                }
                return galleryEntry;
            }
            return await projectDraftGalleryRepository.createGalleryEntry(
                projectDraftId,
                index,
                asset,
            );
        });
    }
}
