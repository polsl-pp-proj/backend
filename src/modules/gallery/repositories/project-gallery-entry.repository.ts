import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Asset } from 'src/modules/asset/entities/asset.entity';
import { ProjectDraft } from 'src/modules/project/entities/project-draft.entity';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { ProjectGalleryEntry } from '../entities/project-gallery-entry.entity';

@Injectable()
export class ProjectGalleryEntryRepository extends Repository<ProjectGalleryEntry> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        entityManager?: EntityManager,
    ) {
        super(
            ProjectGalleryEntry,
            entityManager ?? dataSource.createEntityManager(),
        );
    }

    async createGalleryEntry(projectId: number, index: number, asset: Asset) {
        const galleryEntry = this.create({
            projectId,
            project: { id: projectId },
            asset: asset,
            assetId: asset.id,
            indexPosition: index,
        });
        return await this.save(galleryEntry);
    }

    async createOrUpdateGalleryEntry(
        projectId: number,
        index: number,
        asset: Asset,
    ) {
        return await this.manager.transaction(async (manager) => {
            const projectGalleryRepository = new ProjectGalleryEntryRepository(
                manager.connection,
                manager,
            );

            const galleryEntry = await projectGalleryRepository.findOne({
                where: { projectId, assetId: asset.id },
            });

            if (galleryEntry) {
                if (galleryEntry.indexPosition !== index) {
                    galleryEntry.indexPosition = index;
                    await projectGalleryRepository.save(galleryEntry, {
                        reload: true,
                    });
                }
                return galleryEntry;
            }
            return await projectGalleryRepository.createGalleryEntry(
                projectId,
                index,
                asset,
            );
        });
    }

    async importFromProjectDraftGallery(
        projectId: number,
        projectDraft: ProjectDraft,
    ) {
        return await this.manager.transaction(async (manager) => {
            const projectGalleryRepository = new ProjectGalleryEntryRepository(
                manager.connection,
                manager,
            );

            const galleryEntries: ProjectGalleryEntry[] = [];
            for (let i = 0; i < projectDraft.galleryEntries.length; ++i) {
                const galleryEntry = projectDraft.galleryEntries[i];
                galleryEntries.push(
                    await projectGalleryRepository.createOrUpdateGalleryEntry(
                        projectId,
                        i,
                        galleryEntry.asset,
                    ),
                );
            }
            return galleryEntries;
        });
    }
}
