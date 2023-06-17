import { Type } from 'class-transformer';
import { Category } from '../../category/entities/category.entity';
import {
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';

export class ProjectCategoryBase {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'category_id' })
    categoryId: number;

    @ManyToOne(() => Category, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @CreateDateColumn({ name: 'created_at' })
    @Type(() => Date)
    createdAt: Date;
}
