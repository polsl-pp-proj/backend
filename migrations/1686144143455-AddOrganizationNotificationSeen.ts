import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrganizationNotificationSeen1686144319837
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.organization_notifications
                ADD COLUMN seen boolean NOT NULL DEFAULT FALSE;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
