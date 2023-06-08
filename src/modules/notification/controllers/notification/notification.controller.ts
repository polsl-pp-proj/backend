import {
    Controller,
    Delete,
    MessageEvent,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Sse,
    UseGuards,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { User } from 'src/modules/auth/decorators/param/user.decorator';
import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import { AuthTokenGuard } from 'src/modules/auth/guards/auth-token.guard';
import { NotificationService } from '../../services/notification/notification.service';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { Organization } from 'src/modules/organization/entities/organization.entity';
import { OrganizationMemberRole } from 'src/modules/organization/enums/organization-member-role.enum';

@Controller({ path: 'notification', version: '1' })
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Sse('events')
    @UseGuards(AuthTokenGuard)
    notificationEvents(
        @User() user: AuthTokenPayloadDto,
    ): Observable<MessageEvent> {
        const authTokenExpiresAt = new Date(
            (user as AuthTokenPayloadDto & { exp: number }).exp * 1000,
        ); // close connection after auth token expires

        return of({ data: {} });
    }

    @Patch('organization/:notificationId/mark-seen')
    @UseGuards(AuthTokenGuard)
    async markOrganizationNotificationAsSeen(
        @User() user: AuthTokenPayloadDto,
        @Param('notificationId', ParseIntPipe) notificationId: number,
    ) {
        try {
            await this.notificationService.markOrganizationNotificationAsSeen(
                user.organizations.map((org) => org.organizationId),
                notificationId,
            );
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
            throw ex;
        }
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

    @Patch('organization/:notificationId/mark-not-seen')
    @UseGuards(AuthTokenGuard)
    async markOrganizationNotificationAsNotSeen(
        @User() user: AuthTokenPayloadDto,
        @Param('notificationId', ParseIntPipe) notificationId: number,
    ) {
        try {
            await this.notificationService.markOrganizationNotificationAsNotSeen(
                user.organizations.map((org) => org.organizationId),
                notificationId,
            );
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
            throw ex;
        }
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

    @Delete('organization/:notificationId')
    @UseGuards(AuthTokenGuard)
    async removeOrganizationNotification(
        @User() user: AuthTokenPayloadDto,
        @Param('notificationId', ParseIntPipe) notificationId: number,
    ) {
        try {
            await this.notificationService.removeOrganizationNotification(
                user.organizations
                    .filter((org) => org.role === OrganizationMemberRole.Owner)
                    .map((org) => org.organizationId),
                notificationId,
            );
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
            throw ex;
        }
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
