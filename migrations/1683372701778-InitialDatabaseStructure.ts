import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialDatabaseStructure1683372701778
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE public.user_role AS ENUM 
                ('basic_user', 'moderator', 'administrator')`,
        );
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS public.users
                (
                    id serial NOT NULL,
                    email_address character varying NOT NULL,
                    first_name character varying NOT NULL,
                    last_name character varying NOT NULL,
                    last_verified_as_student timestamp with time zone DEFAULT NULL,
                    role user_role NOT NULL,
                    is_active boolean NOT NULL DEFAULT false,
                    PRIMARY KEY (id)
                )`,
        );
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS public.projects
                (
                    id serial NOT NULL,
                    name character varying(100) NOT NULL,
                    description text NOT NULL,
                    short_description character varying(150) NOT NULL,
                    draft_id integer NOT NULL,
                    funding_objectives text,
                    PRIMARY KEY (id)
                )`,
        );
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS public.project_open_positions
                (
                    id serial NOT NULL,
                    project_id integer NOT NULL,
                    name character varying NOT NULL,
                    description character varying(200) NOT NULL,
                    requirements jsonb NOT NULL DEFAULT '[]',
                    PRIMARY KEY (id)
                )`,
        );
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS public.categories
                (
                    id serial NOT NULL,
                    name character varying(75) NOT NULL,
                    PRIMARY KEY (id)
                )`,
        );
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS public.project_categories
                (
                    project_id integer NOT NULL,
                    category_id integer NOT NULL
                )`,
        );
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS public.favorite_projects
                (
                    project_id integer NOT NULL,
                    user_id integer NOT NULL
                )`,
        );
        await queryRunner.query(
            `CREATE TYPE public.asset_type AS ENUM 
                ('image')`,
        );
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS public.assets
                (
                    id serial NOT NULL,
                    title character varying NOT NULL,
                    url character varying NOT NULL,
                    type asset_type NOT NULL,
                    PRIMARY KEY (id)
                )`,
        );
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS public.project_gallery_entries
                (
                    project_id integer NOT NULL,
                    asset_id integer NOT NULL,
                    index_position integer NOT NULL
                )`,
        );
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS public.project_drafts
                (
                    id serial NOT NULL,
                    name character varying(100) NOT NULL,
                    description text NOT NULL,
                    short_description character varying(150) NOT NULL,
                    owner_organization_id integer NOT NULL,
                    funding_objectives text,
                    PRIMARY KEY (id)
                )`,
        );
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS public.project_draft_gallery_entries
                (
                    project_draft_id integer NOT NULL,
                    asset_id integer NOT NULL,
                    index_position integer NOT NULL
                )`,
        );
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS public.project_draft_categories
                (
                    project_draft_id integer NOT NULL,
                    category_id integer NOT NULL
                )`,
        );
        await queryRunner.query(
            `CREATE TYPE public.project_draft_submission_status AS ENUM 
                ('to_be_resolved', 'rejected', 'published')`,
        );
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS public.project_draft_submissions
                (
                    id serial NOT NULL,
                    project_draft_id integer NOT NULL,
                    status project_draft_submission_status NOT NULL,
                    PRIMARY KEY (id)
                )`,
        );
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS public.organizations
                (
                    id serial NOT NULL,
                    name character varying NOT NULL,
                    PRIMARY KEY (id)
                )`,
        );
        await queryRunner.query(
            `CREATE TYPE public.organization_member_role AS ENUM 
                ('member', 'owner')`,
        );
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS public.organizations_users
                (
                    organization_id integer NOT NULL,
                    user_id integer NOT NULL,
                    role organization_member_role NOT NULL
                )`,
        );
        await queryRunner.query(
            `CREATE TYPE public.credential_type AS ENUM 
                ('password')`,
        );
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS public.credentials
                (
                    id serial NOT NULL,
                    type credential_type NOT NULL,
                    credential character varying(255) NOT NULL,
                    user_id integer NOT NULL,
                    PRIMARY KEY (id)
                )`,
        );
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS public.issued_refresh_tokens
                (
                    id serial NOT NULL,
                    uuid character varying(36) NOT NULL,
                    for_auth_token_uuid character varying(36) NOT NULL,
                    expiry timestamp with time zone NOT NULL,
                    ip_address character varying(39) NOT NULL,
                    user_id integer NOT NULL,
                    PRIMARY KEY (id)
                )`,
        );
        await queryRunner.query(
            `CREATE TYPE public.one_time_token_type AS ENUM 
                (
                    'signup',
                    'password_reset',
                    'student_status_verification'
                )`,
        );
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS public.one_time_tokens
                (
                    id serial NOT NULL,
                    uuid character varying(36) NOT NULL,
                    type one_time_token_type NOT NULL,
                    expiry timestamp with time zone NOT NULL,
                    is_active boolean NOT NULL DEFAULT false,
                    user_id integer NOT NULL,
                    PRIMARY KEY (id)
                )`,
        );
        await queryRunner.query(
            `CREATE TYPE public.organization_notification_type AS ENUM 
                (
                    'project_draft_submission_rejected',
                    'project_draft_submission_published',
                    'project_open_position_application',
                    'project_message'
                )`,
        );
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS public.organization_notifications
                (
                    id serial NOT NULL,
                    subject character varying(150) NOT NULL,
                    message text NOT NULL,
                    project_id integer NOT NULL,
                    sender_user_id integer NOT NULL,
                    type organization_notification_type NOT NULL,
                    PRIMARY KEY (id)
                )`,
        );
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS public.project_donations
                (
                    id serial NOT NULL,
                    project_id integer NOT NULL,
                    user_id integer NOT NULL,
                    amount double precision NOT NULL,
                    is_anonymous boolean NOT NULL,
                    PRIMARY KEY (id)
                )`,
        );
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS public.project_draft_open_positions
                (
                    id serial NOT NULL,
                    project_draft_id integer NOT NULL,
                    name character varying NOT NULL,
                    description character varying(200) NOT NULL,
                    requirements jsonb NOT NULL DEFAULT '[]',
                    PRIMARY KEY (id)
                )`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX uq_email_address 
                ON users ((lower(email_address)))`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_categories
                ADD FOREIGN KEY (project_id)
                REFERENCES public.projects (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_categories
                ADD FOREIGN KEY (category_id)
                REFERENCES public.categories (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.favorite_projects
                ADD FOREIGN KEY (project_id)
                REFERENCES public.projects (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.favorite_projects
                ADD FOREIGN KEY (user_id)
                REFERENCES public.users (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_gallery_entries
                ADD FOREIGN KEY (project_id)
                REFERENCES public.projects (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_gallery_entries
                ADD FOREIGN KEY (asset_id)
                REFERENCES public.assets (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_drafts
                ADD FOREIGN KEY (owner_organization_id)
                REFERENCES public.organizations (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                NOT VALID`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_draft_gallery_entries
                ADD FOREIGN KEY (project_draft_id)
                REFERENCES public.project_drafts (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_draft_gallery_entries
                ADD FOREIGN KEY (asset_id)
                REFERENCES public.assets (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_draft_categories
                ADD FOREIGN KEY (project_draft_id)
                REFERENCES public.project_drafts (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_draft_categories
                ADD FOREIGN KEY (category_id)
                REFERENCES public.categories (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_draft_submissions
                ADD FOREIGN KEY (project_draft_id)
                REFERENCES public.project_drafts (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.organizations_users
                ADD FOREIGN KEY (organization_id)
                REFERENCES public.organizations (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.organizations_users
                ADD FOREIGN KEY (user_id)
                REFERENCES public.users (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.credentials
                ADD FOREIGN KEY (user_id)
                REFERENCES public.users (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.issued_refresh_tokens
                ADD FOREIGN KEY (user_id)
                REFERENCES public.users (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.one_time_tokens
                ADD FOREIGN KEY (user_id)
                REFERENCES public.users (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.organization_notifications
                ADD FOREIGN KEY (project_id)
                REFERENCES public.projects (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.organization_notifications
                ADD FOREIGN KEY (sender_user_id)
                REFERENCES public.users (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_donations
                ADD FOREIGN KEY (project_id)
                REFERENCES public.projects (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_donations
                ADD FOREIGN KEY (user_id)
                REFERENCES public.users (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID`,
        );
        await queryRunner.query(
            `ALTER TABLE IF EXISTS public.project_draft_open_positions
                ADD FOREIGN KEY (project_draft_id)
                REFERENCES public.project_drafts (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE CASCADE
                NOT VALID`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query('');
    }
}
