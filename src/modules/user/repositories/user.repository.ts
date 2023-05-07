import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        entityManager?: EntityManager,
    ) {
        super(User, entityManager ?? dataSource.createEntityManager());
    }

    async insertUser(userData: {
        emailAddress: string;
        firstName: string;
        lastName: string;
        role: UserRole;
    }): Promise<User> {
        const userEntity: User = this.create({
            ...userData,
            lastVerifiedAsStudent: new Date(),
            isActive: false,
        });
        return await this.save(userEntity, { reload: true });
    }
}
