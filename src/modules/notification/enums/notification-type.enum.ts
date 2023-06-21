export enum NotificationType {
    ProjectMessage = 'project_message',
    OpenPositionApplication = 'project_open_position_application',
    ProjectDraftPublication = 'project_draft_submission_published',
    ProjectDraftRejection = 'project_draft_submission_rejected',
    MessageAnswer = 'message_answer',
}

export type OrganizationOnlyNotificationType =
    | NotificationType.OpenPositionApplication
    | NotificationType.ProjectDraftPublication
    | NotificationType.ProjectDraftRejection
    | NotificationType.ProjectMessage;

export type UserOnlyNotificationType = NotificationType.MessageAnswer;
