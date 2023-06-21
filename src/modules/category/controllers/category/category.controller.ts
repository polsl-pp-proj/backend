import {
    Body,
    ConflictException,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { CategoryNameDto } from '../../dtos/category-name.dto';
import { UserRole } from 'src/modules/user/enums/user-role.enum';
import { validationConfig } from 'src/configs/validation.config';
import { CategoryDto } from '../../dtos/category.dto';
import { UniqueConstraintViolationException } from 'src/exceptions/unique-constraint-violation.exception';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { AuthTokenPayload } from 'src/modules/auth/decorators/param/user.decorator';
import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import { AuthTokenGuard } from 'src/modules/auth/guards/auth-token.guard';
import { CategoryService } from '../../services/category/category.service';

@Controller({ path: 'category', version: '1' })
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    async getAllCategories(): Promise<CategoryDto[]> {
        return this.categoryService.getAllCategories();
    }

    @Post()
    @UseGuards(AuthTokenGuard)
    async createCategory(
        @AuthTokenPayload() user: AuthTokenPayloadDto,
        @Body(new ValidationPipe(validationConfig))
        createCategoryDto: CategoryNameDto,
    ): Promise<void> {
        if (user.role !== UserRole.Administrator) {
            throw new ForbiddenException('user_not_admin');
        }
        try {
            const { name } = createCategoryDto;
            await this.categoryService.createCategory(name);
        } catch (error) {
            if (error instanceof UniqueConstraintViolationException) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Patch(':id')
    @UseGuards(AuthTokenGuard)
    async changeCategoryName(
        @AuthTokenPayload() user: AuthTokenPayloadDto,
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe(validationConfig))
        changeCategoryNameDto: CategoryNameDto,
    ): Promise<void> {
        if (user.role !== UserRole.Administrator) {
            throw new ForbiddenException('user_not_admin');
        }
        try {
            await this.categoryService.changeCategoryName(
                id,
                changeCategoryNameDto.name,
            );
        } catch (error) {
            if (error instanceof RecordNotFoundException) {
                throw new NotFoundException(error.message);
            } else if (error instanceof UniqueConstraintViolationException) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Delete(':id')
    @UseGuards(AuthTokenGuard)
    async deleteCategory(
        @AuthTokenPayload() user: AuthTokenPayloadDto,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<void> {
        if (user.role !== UserRole.Administrator) {
            throw new ForbiddenException('user_not_admin');
        }
        try {
            await this.categoryService.deleteCategory(id);
        } catch (error) {
            if (error instanceof RecordNotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }
}
