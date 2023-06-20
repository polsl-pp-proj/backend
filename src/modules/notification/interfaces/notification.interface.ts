import { NotificationType } from '../enums/notification-type.enum';

export const NotificationQuery = (limit: number, offset: number) => {
    if (!isFinite(limit) || !isFinite(offset)) {
        throw new Error('limit_or_offset_not_finite');
    }
    return `WITH "notifications" AS (
    SELECT
        "combined_queries_alias"."id",
        "combined_queries_alias"."subject",
        "combined_queries_alias"."message",
        "combined_queries_alias"."projectId",
        "combined_queries_alias"."projectName",
        "combined_queries_alias"."organizationId",
        "combined_queries_alias"."organizationName",
        "combined_queries_alias"."type",
        "combined_queries_alias"."seen",
        "combined_queries_alias"."createdAt",
        "combined_queries_alias"."updatedAt"
    FROM
        (
            (
                SELECT
                    "organizationNotifications"."id" AS "id",
                    "organizationNotifications"."subject" AS "subject",
                    "organizationNotifications"."message" AS "message",
                    "organizationNotifications"."seen" AS "seen",
                    "organizationNotifications"."created_at" AS "createdAt",
                    "organizationNotifications"."updated_at" AS "updatedAt",
                    "project"."id" AS "projectId",
                    "project"."name" AS "projectName",
                    "organization"."id" AS "organizationId",
                    "organization"."name" AS "organizationName",
                    "organizationNotifications"."type" :: TEXT AS "type"
                FROM
                    "organization_notifications" "organizationNotifications"
                    LEFT JOIN "projects" "project" ON "project"."id" = "organizationNotifications"."project_id"
                    LEFT JOIN "project_drafts" "projectDraft" ON "projectDraft"."id" = "project"."draft_id"
                    LEFT JOIN "organizations" "organization" ON "organization"."id" = "projectDraft"."owner_organization_id"
                    INNER JOIN "organizations_users" "organizationUsers" ON "organizationUsers"."organization_id" = "organization"."id"
                    AND (
                        "organization"."id" = "organizationUsers"."organization_id"
                        AND "organizationUsers"."user_id" = $1
                    )
                WHERE
                    "organizationNotifications"."deleted_at" IS NULL
                ORDER BY
                    "organizationNotifications"."created_at" DESC NULLS LAST
            )
            UNION
            (
                SELECT
                    "userNotifications"."id" AS "id",
                    "userNotifications"."subject" AS "subject",
                    "userNotifications"."message" AS "message",
                    "userNotifications"."seen" AS "seen",
                    "userNotifications"."created_at" AS "createdAt",
                    "userNotifications"."updated_at" AS "updatedAt",
                    "project"."id" AS "projectId",
                    "project"."name" AS "projectName",
                    "organization"."id" AS "organizationId",
                    "organization"."name" AS "organizationName",
                    'message_answer' AS "type"
                FROM
                    "user_notifications" "userNotifications"
                    LEFT JOIN "projects" "project" ON "project"."id" = "userNotifications"."project_id"
                    LEFT JOIN "project_drafts" "projectDraft" ON "projectDraft"."id" = "project"."draft_id"
                    LEFT JOIN "organizations" "organization" ON "organization"."id" = "projectDraft"."owner_organization_id"
                WHERE
                    ("userNotifications"."user_id" = $1)
                    AND ("userNotifications"."deleted_at" IS NULL)
                ORDER BY
                    "userNotifications"."created_at" DESC NULLS LAST
            )
        ) "combined_queries_alias"
    GROUP BY
        "id",
        "subject",
        "message",
        "projectId",
        "projectName",
        "organizationId",
        "organizationName",
        "type",
        "seen",
        "createdAt",
        "updatedAt"
    ORDER BY
        "combined_queries_alias"."createdAt" DESC NULLS LAST
)
SELECT c."count", n.* 
FROM
    (SELECT COUNT(*) as "count" from "notifications") AS c
    LEFT JOIN
    (SELECT * FROM "notifications" LIMIT ${limit} OFFSET ${offset}) as n
    ON true
ORDER BY n."createdAt" DESC`;
};

export interface INotification {
    id: number;
    subject: string;
    message: string;
    projectId: number;
    projectName: string;
    organizationId: number;
    organizationName: string;
    type: NotificationType;
    seen: boolean;
    createdAt: Date;
    updatedAt: Date;
}
