import { Injectable } from '@nestjs/common';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { CategoryDto } from '../../dtos/category.dto';
import { CategoryRepository } from '../../repositories/category.repository';
import { convertCategoryToCategoryDto } from '../../helpers/category-to-category-dto.helper';

@Injectable()
export class CategoryService {
    constructor(private readonly categoryRepository: CategoryRepository) {}

    async getAllCategories(): Promise<CategoryDto[]> {
        const categories = await this.categoryRepository.find();
        return categories.map((category) =>
            convertCategoryToCategoryDto(category),
        );
    }

    async createCategory(name: string) {
        await this.categoryRepository.createCategory(name);
    }

    async changeCategoryName(id: number, newName: string) {
        await this.categoryRepository.changeCategoryName(id, newName);
    }

    async deleteCategory(id: number) {
        await this.categoryRepository.deleteCategory(id);
    }
}
