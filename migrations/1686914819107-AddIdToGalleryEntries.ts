import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIdToGalleryEntries1686914819107 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_draft_gallery_entries
                ADD COLUMN id serial NOT NULL;`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_draft_gallery_entries
                ADD PRIMARY KEY(id);`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_gallery_entries
                ADD COLUMN id serial NOT NULL;`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_gallery_entries
                ADD PRIMARY KEY(id);`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
