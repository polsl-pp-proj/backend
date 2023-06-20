import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectDraftIdToNotification1687262118141
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE public.organization_notifications 
                ALTER COLUMN project_id DROP NOT NULL;`,
        );
        await queryRunner.query(
            `ALTER TABLE public.organization_notifications 
                ADD COLUMN project_draft_id integer;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
