import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserNotifications1686144119433 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS public.user_notifications
                (
                    id serial NOT NULL,
                    subject character varying(150) NOT NULL,
                    message text NOT NULL,
                    user_id integer NOT NULL,
                    project_id integer NOT NULL,
                    seen boolean NOT NULL DEFAULT FALSE,
                    PRIMARY KEY (id)
                )`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
