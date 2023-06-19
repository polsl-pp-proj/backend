import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Query,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { AuthTokenPayload } from 'src/modules/auth/decorators/param/user.decorator';
import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import { AuthTokenGuard } from 'src/modules/auth/guards/auth-token.guard';
import { UserRole } from '../../enums/user-role.enum';
import { UserService } from '../../services/user/user.service';
import { validationConfig } from 'src/configs/validation.config';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';

@Controller({ path: 'user', version: '1' })
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @UseGuards(AuthTokenGuard)
    async getUsers(
        @AuthTokenPayload() user: AuthTokenPayloadDto,
        @Query(new ValidationPipe(validationConfig))
        paginationParams: PaginationDto,
    ) {
        if (user.role !== UserRole.Administrator) {
            throw new ForbiddenException('user_not_administrator');
        }
        return await this.userService.getUsers(paginationParams);
    }

    @Get(':userId')
    @UseGuards(AuthTokenGuard)
    async getUser(
        @AuthTokenPayload() user: AuthTokenPayloadDto,
        @Param('userId', ParseIntPipe) userId: number,
    ) {
        if (user.role !== UserRole.Administrator) {
            throw new ForbiddenException('user_not_administrator');
        }
        try {
            return await this.userService.getUser(userId);
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
            throw ex;
        }
    }

    @Patch(':userId')
    @UseGuards(AuthTokenGuard)
    async updateUser(
        @AuthTokenPayload() user: AuthTokenPayloadDto,
        @Param('userId', ParseIntPipe) userId: number,
        @Body(new ValidationPipe(validationConfig))
        updateUserDto: UpdateUserDto,
    ) {
        if (user.role !== UserRole.Administrator) {
            throw new ForbiddenException('user_not_administrator');
        }
        try {
            return await this.userService.updateUser(userId, updateUserDto);
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
            throw ex;
        }
    }

    @Delete(':userId')
    @UseGuards(AuthTokenGuard)
    async removeUser(
        @AuthTokenPayload() user: AuthTokenPayloadDto,
        @Param('userId', ParseIntPipe) userId: number,
    ) {
        if (user.role !== UserRole.Administrator) {
            throw new ForbiddenException('user_not_administrator');
        }
        try {
            return await this.userService.removeUser(userId);
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
            throw ex;
        }
    }
}
