import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryDto } from '../dtos/category.dto';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { convertCategoryToCategoryDto } from '../helpers/category-to-category-dto.helper';
@Injectable()
export class CategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository,) {}

    async getAllCategories(): Promise<CategoryDto[]>{
        const categories = await this.categoryRepository.find();
        return categories.map((category) => {
            return convertCategoryToCategoryDto(category);
        });
    }

    async getCategoryById(id: number): Promise<CategoryDto> {
        const category = await this.categoryRepository.findOne({
            where: { id },
        });
        
        if(!category){
            throw new RecordNotFoundException('category_with_id_not_found');
        }
        
        return convertCategoryToCategoryDto(category);
    }


    async createCategory(
        createCategoryDto: CreateCategoryDto,
    ) {
        await this.categoryRepository.createCategory(
            createCategoryDto,
        );
    }

    async deleteCategory(id: number): Promise<void> {
        const category = await this.categoryRepository.findOne({
            where: { id },
        });
    
        if (!category) {
            throw new RecordNotFoundException('category_with_id_not_found');
        }
    
        await this.categoryRepository.remove(category);
    }
}