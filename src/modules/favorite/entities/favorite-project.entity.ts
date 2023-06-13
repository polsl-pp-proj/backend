import { Type } from 'class-transformer';
import { User } from 'src/modules/user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
} from 'typeorm';

@Entity({ name: 'favorite_projects' })
export class FavoriteProject {
    @Column({ name: 'project_id' })
    projectId: number;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn({ name: 'created_at' })
    @Type(() => Date)
    createdAt: Date;
}
