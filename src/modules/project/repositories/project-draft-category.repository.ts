import { DataSource, EntityManager, In, Not, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ProjectDraftCategory } from '../entities/project-draft-category.entity';

export class ProjectDraftCategoryRepository extends Repository<ProjectDraftCategory> {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly entityManager?: EntityManager,
    ) {
        super(
            ProjectDraftCategory,
            entityManager ?? dataSource.createEntityManager(),
        );
    }

    async updateProjectDraftCategories(
        projectDraftId: number,
        categories: number[],
    ) {
        return await this.entityManager.transaction(async (manager) => {
            const projectDraftCategoryRepository =
                new ProjectDraftCategoryRepository(manager.connection, manager);

            const projectDraftCategories = categories.map((category) => ({
                projectDraftId: projectDraftId,
                projectDraft: { id: projectDraftId },
                category: { id: category },
                categoryId: category,
            })) as ProjectDraftCategory[];

            await projectDraftCategoryRepository.delete({
                projectDraftId,
                categoryId: Not(In(categories)),
            });

            await projectDraftCategoryRepository
                .createQueryBuilder('projectDraftCategory')
                .insert()
                .values(projectDraftCategories)
                .orIgnore()
                .execute();
        });
    }
}
