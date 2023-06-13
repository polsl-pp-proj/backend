export enum NotificationType {
    ProjectMessage = 'project_message',
    OpenPositionApplication = 'open_position_application',
    ProjectDraftPublication = 'project_draft_publication',
    ProjectDraftRejection = 'project_draft_rejection',
    MessageAnswer = 'message_answer',
}

export type OrganizationOnlyNotificationType =
    | NotificationType.OpenPositionApplication
    | NotificationType.ProjectDraftPublication
    | NotificationType.ProjectDraftRejection
    | NotificationType.ProjectMessage;

export type UserOnlyNotificationType = NotificationType.MessageAnswer;
