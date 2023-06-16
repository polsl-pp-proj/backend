import { Type } from 'class-transformer';
import { Project } from 'src/modules/project/entities/project.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'favorite_projects' })
export class FavoriteProject {
    @PrimaryColumn({ name: 'project_id' })
    projectId: number;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @PrimaryColumn({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn({ name: 'created_at' })
    @Type(() => Date)
    createdAt: Date;
}
