import { Category } from '../entities/category.entity';
import { CategoryDto } from '../dtos/category.dto';

export const convertCategoryToCategoryDto = (
    category: Category,
): CategoryDto => {
    return new CategoryDto({
        id: category.id,
        name: category.name,
    });
};
