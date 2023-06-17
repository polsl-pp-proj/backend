import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { checkUniqueViolation } from 'src/helpers/check-unique-violation.helper';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';

@Injectable()
export class CategoryRepository extends Repository<Category> {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly entityManager?: EntityManager,
    ) {
        super(Category, entityManager ?? dataSource.createEntityManager());
    }

    async createCategory(name: string) {
        try {
            const newCategory = this.create({ name });
            await this.save(newCategory);
        } catch (error) {
            checkUniqueViolation(error, `category_name_exists`);
            throw error;
        }
    }

    async changeCategoryName(id: number, newName: string) {
        try {
            const updateResult = await this.update(id, { name: newName });

            if (updateResult.affected === 0) {
                throw new RecordNotFoundException('category_does_not_exist');
            }
        } catch (error) {
            checkUniqueViolation(error, 'category_name_exists');
            throw error;
        }
    }

    async deleteCategory(id: number) {
        const deleteResult = await this.delete({ id });

        if (deleteResult.affected === 0) {
            throw new RecordNotFoundException('category_does_not_exist');
        }
    }
}
