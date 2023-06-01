import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProjectDonations1685625527319 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_donations
                        ADD COLUMN payment_intent_id character varying NOT NULL,
                        ADD COLUMN payment_finished boolean NOT NULL DEFAULT FALSE;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
