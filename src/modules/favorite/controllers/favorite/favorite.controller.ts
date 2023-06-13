import {
    ConflictException,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AuthTokenPayload } from 'src/modules/auth/decorators/param/user.decorator';
import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import { AuthTokenGuard } from 'src/modules/auth/guards/auth-token.guard';
import { FavoriteService } from '../../services/favorite/favorite.service';
import { UniqueConstraintViolationException } from 'src/exceptions/unique-constraint-violation.exception';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';

@Controller({ path: 'favorite', version: '1' })
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) {}

    @Get()
    @UseGuards(AuthTokenGuard)
    async getFavoritesList(
        @AuthTokenPayload() authTokenPayloadDto: AuthTokenPayloadDto,
    ) {
        return convertToSimpleProjectDtoArray(
            await this.favoriteService.getUsersFavorites(
                authTokenPayloadDto.userId,
            ),
        );
    }

    @Get('simple')
    @UseGuards(AuthTokenGuard)
    async getSimpleFavoritesList(
        @AuthTokenPayload() authTokenPayloadDto: AuthTokenPayloadDto,
    ) {
        return (
            await this.favoriteService.getUsersFavorites(
                authTokenPayloadDto.userId,
            )
        ).map((project) => project.id);
    }

    @Get(':projectId')
    @UseGuards(AuthTokenGuard)
    async getIsFavorite(
        @Param('projectId', ParseIntPipe) projectId: number,
        @AuthTokenPayload() authTokenPayloadDto: AuthTokenPayloadDto,
    ) {
        return await this.favoriteService.isUsersFavorite(
            authTokenPayloadDto.userId,
            projectId,
        );
    }

    @Post(':projectId')
    @UseGuards(AuthTokenGuard)
    async addToFavorites(
        @Param('projectId', ParseIntPipe) projectId: number,
        @AuthTokenPayload() authTokenPayloadDto: AuthTokenPayloadDto,
    ) {
        try {
            await this.favoriteService.addToUsersFavorites(
                authTokenPayloadDto.userId,
                projectId,
            );
        } catch (ex) {
            if (ex instanceof UniqueConstraintViolationException) {
                throw new ConflictException(ex.message);
            }
            throw ex;
        }
    }

    @Delete(':projectId')
    @UseGuards(AuthTokenGuard)
    async removeFromFavorites(
        @Param('projectId', ParseIntPipe) projectId: number,
        @AuthTokenPayload() authTokenPayloadDto: AuthTokenPayloadDto,
    ) {
        try {
            await this.favoriteService.removeFromUsersFavorites(
                authTokenPayloadDto.userId,
                projectId,
            );
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
            throw ex;
        }
    }
}
