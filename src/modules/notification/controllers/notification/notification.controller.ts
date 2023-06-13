import {
    Controller,
    Delete,
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
        return new Observable<MessageEvent>((subscriber) => {
            const subscription = this.notificationService
                .getNotificationObservable(user)
                .subscribe({
                    next: (notification) => {
                        subscriber.next({
                            type: 'notification',
                            data: notification,
                        });
                    },
                    complete: () => {
                        subscriber.next({
                            type: 'close_connection',
                            data: 'reconnect',
                        });
                        subscriber.complete();
                        subscription.unsubscribe();
                    },
                });
        });
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
