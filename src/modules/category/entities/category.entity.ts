import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'name' })
    name: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
