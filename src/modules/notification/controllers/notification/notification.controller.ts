import {
    Controller,
    Delete,
    ForbiddenException,
    Get,
    MessageEvent,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Query,
    Sse,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/modules/auth/decorators/param/user.decorator';
import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import { AuthTokenGuard } from 'src/modules/auth/guards/auth-token.guard';
import { NotificationService } from '../../services/notification/notification.service';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { OrganizationMemberRole } from 'src/modules/organization/enums/organization-member-role.enum';
import { validationConfig } from 'src/configs/validation.config';
import { PaginationDto } from 'src/dtos/pagination.dto';

@Controller({ path: 'notification', version: '1' })
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Sse('events')
    @UseGuards(AuthTokenGuard)
    notificationEvents(
        @User() user: AuthTokenPayloadDto & { exp: number },
    ): Observable<MessageEvent> {
        return this.notificationService.getNotificationObservable(user);
    }

    @Get()
    @UseGuards(AuthTokenGuard)
    async getNotifications(
        @User() user: AuthTokenPayloadDto,
        @Query(new ValidationPipe(validationConfig))
        paginationParams: PaginationDto,
    ) {
        return await this.notificationService.getNotificationsForUser(
            user.userId,
            paginationParams,
        );
    }

    @Patch('organization/:organizationId/:notificationId/mark-seen')
    @UseGuards(AuthTokenGuard)
    async markOrganizationNotificationAsSeen(
        @User() user: AuthTokenPayloadDto,
        @Param('organizationId', ParseIntPipe) organizationId: number,
        @Param('notificationId', ParseIntPipe) notificationId: number,
    ) {
        if (
            user.organizations.some(
                (org) => org.organizationId === organizationId,
            )
        ) {
            try {
                await this.notificationService.markOrganizationNotificationAsSeen(
                    organizationId,
                    notificationId,
                );
            } catch (ex) {
                if (ex instanceof RecordNotFoundException) {
                    throw new NotFoundException(ex.message);
                }
                throw ex;
            }
            return;
        }
        throw new ForbiddenException('user_not_in_organization');
    }

    @Patch('user/:notificationId/mark-seen')
    @UseGuards(AuthTokenGuard)
    async markUserNotificationAsSeen(
        @User() user: AuthTokenPayloadDto,
        @Param('notificationId', ParseIntPipe) notificationId: number,
    ) {
        try {
            await this.notificationService.markUserNotificationAsSeen(
                user.userId,
                notificationId,
            );
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
            throw ex;
        }
    }

    @Patch('organization/:organizationId/:notificationId/mark-not-seen')
    @UseGuards(AuthTokenGuard)
    async markOrganizationNotificationAsNotSeen(
        @User() user: AuthTokenPayloadDto,
        @Param('organizationId', ParseIntPipe) organizationId: number,
        @Param('notificationId', ParseIntPipe) notificationId: number,
    ) {
        if (
            user.organizations.some(
                (org) => org.organizationId === organizationId,
            )
        ) {
            try {
                await this.notificationService.markOrganizationNotificationAsNotSeen(
                    organizationId,
                    notificationId,
                );
            } catch (ex) {
                if (ex instanceof RecordNotFoundException) {
                    throw new NotFoundException(ex.message);
                }
                throw ex;
            }
            return;
        }
        throw new ForbiddenException('user_not_in_organization');
    }

    @Patch('user/:notificationId/mark-not-seen')
    @UseGuards(AuthTokenGuard)
    async markUserNotificationAsNotSeen(
        @User() user: AuthTokenPayloadDto,
        @Param('notificationId', ParseIntPipe) notificationId: number,
    ) {
        try {
            await this.notificationService.markUserNotificationAsNotSeen(
                user.userId,
                notificationId,
            );
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
            throw ex;
        }
    }

    @Delete('organization/:organizationId/:notificationId')
    @UseGuards(AuthTokenGuard)
    async removeOrganizationNotification(
        @User() user: AuthTokenPayloadDto,
        @Param('organizationId', ParseIntPipe) organizationId: number,
        @Param('notificationId', ParseIntPipe) notificationId: number,
    ) {
        if (
            user.organizations.some(
                (org) =>
                    org.organizationId === organizationId &&
                    org.role === OrganizationMemberRole.Owner,
            )
        ) {
            try {
                await this.notificationService.removeOrganizationNotification(
                    organizationId,
                    notificationId,
                );
            } catch (ex) {
                if (ex instanceof RecordNotFoundException) {
                    throw new NotFoundException(ex.message);
                }
                throw ex;
            }
            return;
        }
        throw new ForbiddenException('user_not_organization_owner');
    }

    @Delete('user/:notificationId')
    @UseGuards(AuthTokenGuard)
    async removeUserNotification(
        @User() user: AuthTokenPayloadDto,
        @Param('notificationId', ParseIntPipe) notificationId: number,
    ) {
        try {
            await this.notificationService.removeUserNotification(
                user.userId,
                notificationId,
            );
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
            throw ex;
        }
    }
}
