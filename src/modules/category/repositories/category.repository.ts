import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';

@Injectable()

export class CategoryRepository extends Repository<Category> {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
         private readonly entityManager?: EntityManager) {
            super(Category, entityManager ?? dataSource.createEntityManager());
        }

        async createCategory(
            createCategoryDto: CreateCategoryDto,
        ) {
            await this.entityManager.transaction( async (entityManager) => {
                const categoryRepository = new CategoryRepository(
                    entityManager.connection,
                    entityManager,
                );
                const newCategory = categoryRepository.createCategory({
                    name: createCategoryDto.name,
                });
                await categoryRepository.save(newCategory);

            })
        }
        async deleteCategory(id: number): Promise<void> {
            const category = await this.findOne(id);
        
            if (!category) {
                throw new RecordNotFoundException('category_with_id_not_found');
            }
        
            await this.remove(category);
        }
}

