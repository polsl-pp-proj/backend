import { DataSource, EntityManager, In, Not, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ProjectCategory } from '../entities/project-category.entity';
import { ProjectDraftCategory } from '../entities/project-draft-category.entity';

export class ProjectCategoryRepository extends Repository<ProjectCategory> {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly entityManager?: EntityManager,
    ) {
        super(
            ProjectCategory,
            entityManager ?? dataSource.createEntityManager(),
        );
    }

    async importCategoriesFromProjectDraft(
        projectId: number,
        projectDraftCategories: ProjectDraftCategory[],
    ) {
        return await this.updateProjectCategories(
            projectId,
            projectDraftCategories.map((category) => category.categoryId),
        );
    }

    async updateProjectCategories(projectId: number, categories: number[]) {
        return await this.entityManager.transaction(async (manager) => {
            const projectCategoryRepository = new ProjectCategoryRepository(
                manager.connection,
                manager,
            );
            const projectCategories: ProjectCategory[] = categories.map(
                (categoryId) =>
                    projectCategoryRepository.create({
                        projectId,
                        project: { id: projectId },
                        categoryId,
                        category: { id: categoryId },
                    }),
            );

            await projectCategoryRepository.delete({
                projectId,
                categoryId: Not(In(categories)),
            });

            await projectCategoryRepository
                .createQueryBuilder('projectCategory')
                .insert()
                .values(projectCategories)
                .orIgnore()
                .execute();
        });
    }
}
