export class CategoryDto {
    id: number;
    name: string;

    constructor(partialCategoryDto: Partial<CategoryDto> = {}){
        Object.assign(this, partialCategoryDto);
    }
}