import { MigrationInterface, QueryRunner } from 'typeorm';

export class FullTextSearchForProjects1687011937386
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "projects" ADD "search_vector" tsvector`,
        );
        await queryRunner.query(
            `CREATE INDEX "project_name_idx" ON "projects" USING GIST ("name" gist_trgm_ops)`,
        );
        await queryRunner.query(
            `CREATE INDEX "project_description_idx" ON "projects" USING GIST ("description" gist_trgm_ops)`,
        );
        await queryRunner.query(
            `CREATE OR REPLACE FUNCTION update_project_search_vector()
RETURNS trigger AS $$
BEGIN 
    NEW.search_vector :=
        setweight(to_tsvector(coalesce(NEW."name", '')),'A') 
        || setweight(to_tsvector(coalesce(NEW."description", '')),'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;`,
        );
        await queryRunner.query(
            `CREATE TRIGGER trigger_project_search_vector_update
BEFORE INSERT OR UPDATE
ON "projects"
FOR EACH ROW
EXECUTE FUNCTION update_project_search_vector();`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TRIGGER "trigger_project_search_vector_update"`,
        );
        await queryRunner.query(
            `DROP FUNCTION IF EXISTS update_project_search_vector`,
        );
        await queryRunner.query(`DROP INDEX "project_description_idx"`);
        await queryRunner.query(`DROP INDEX "project_name_idx"`);
        await queryRunner.query(
            `ALTER TABLE "projects" DROP COLUMN "search_vector"`,
        );
    }
}
