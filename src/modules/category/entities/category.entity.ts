import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'name' })
    name: string;
}
