import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { AssetType } from '../enums/asset-type.enum';

@Entity({ name: 'assets' })
export class Asset {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'title' })
    title: string;

    @Column({ name: 'url' })
    url: string;

    @Column({
        type: 'enum',
        enum: AssetType,
        enumName: 'asset_type',
        name: 'type',
    })
    type: AssetType;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
