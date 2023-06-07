import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimestamps1686144143455 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.users
                ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now(),
                ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT now();`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.projects
                ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now(),
                ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT now();`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_open_positions
                ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now(),
                ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT now();`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.categories
                ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now();`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_categories
                ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now();`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.favorite_projects
                ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now();`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.assets
            ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now();`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_gallery_entries
                ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now(),
                ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT now();`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_drafts
                ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now(),
                ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT now();`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_draft_gallery_entries
                ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now(),
                ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT now();`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_draft_categories
                ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now();`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_draft_submissions
                ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now(),
                ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT now();`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.organizations
                ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now();`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.organizations_users
                ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now(),
                ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT now();`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.credentials
                ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now(),
                ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT now();`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.issued_refresh_tokens
                ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now(),
                ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT now();`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.one_time_tokens
                ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now(),
                ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT now();`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.organization_notifications
                ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now(),
                ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT now(),
                ADD COLUMN deleted_at timestamp with time zone DEFAULT NULL;`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_donations
                ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now(),
                ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT now();`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_draft_open_positions
                ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now(),
                ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT now();`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.user_notifications
                ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now(),
                ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT now(),
                ADD COLUMN deleted_at timestamp with time zone DEFAULT NULL;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
