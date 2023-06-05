import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    NotFoundException,
    NotImplementedException,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { validationConfig } from 'src/configs/validation.config';
import { AuthTokenGuard } from 'src/modules/auth/guards/auth-token.guard';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { AuthTokenPayload } from 'src/modules/auth/decorators/param/user.decorator';
import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import { CategoryDto } from '../dtos/category.dto';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { CreateOrganizationDto } from 'src/modules/organization/dtos/create-organization.dto';
import { UserRole } from 'src/modules/user/enums/user-role.enum';

@Controller({ path: 'category', version: '1' })
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }
    @Get()
    async getAllOrganizations(): Promise<CategoryDto[]> {
        return await this.categoryService.getAllCategories();
    }

    @Get(':categoryId')
    async getOrganizationById(
        @Param('categoryId', ParseIntPipe) categoryId: number,
    ): Promise<CategoryDto> {
        try {
            return await this.categoryService.getCategoryById(
                categoryId,
            );
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
            throw ex;
        }
    }

    @Post()
    @UseGuards(AuthTokenGuard)
    async createOrganization(
        @AuthTokenPayload() user: AuthTokenPayloadDto,
        @Body(new ValidationPipe(validationConfig))
        CreateCategoryDto: CreateCategoryDto,
    ): Promise<void> {
        if (UserRole.Administrator) {
            await this.categoryService.createCategory(
                CreateCategoryDto,
            );
            return;
        }
        throw new ForbiddenException('user_not_administrator');
    }
}
