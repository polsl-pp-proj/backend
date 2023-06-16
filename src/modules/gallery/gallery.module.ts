import { Module } from '@nestjs/common';
import { ProjectGalleryEntry } from './entities/project-gallery-entry.entity';
import { ProjectDraftGalleryEntry } from './entities/project-draft-gallery-entry.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetModule } from '../asset/asset.module';
import { ProjectDraftGalleryEntryRepository } from './repositories/project-draft-gallery-entry.repository';
import { ProjectGalleryEntryRepository } from './repositories/project-gallery-entry.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProjectGalleryEntry,
            ProjectDraftGalleryEntry,
        ]),
        AssetModule,
    ],
    providers: [
        ProjectDraftGalleryEntryRepository,
        ProjectGalleryEntryRepository,
    ],
    exports: [
        ProjectDraftGalleryEntryRepository,
        ProjectGalleryEntryRepository,
    ],
})
export class GalleryModule {}
