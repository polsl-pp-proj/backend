import { Type } from 'class-transformer';
import { Category } from '../../category/entities/category.entity';
import {
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    PrimaryColumn,
} from 'typeorm';

export class ProjectCategoryBase {
    @PrimaryColumn({ name: 'category_id' })
    categoryId: number;

    @ManyToOne(() => Category, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @CreateDateColumn({ name: 'created_at' })
    @Type(() => Date)
    createdAt: Date;
}
