import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { UserRepository } from '../../repositories/user.repository';
import { userToSimpleUserDto } from '../../helpers/user-to-simple-user-dto.helper';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { userToUserDto } from '../../helpers/user-to-user-dto.helper';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async getUsers({ page, elementsPerPage }: PaginationDto) {
        const users = await this.userRepository.find({
            take: elementsPerPage,
            skip: elementsPerPage * (page - 1),
        });

        return users.map((user) => userToSimpleUserDto(user));
    }

    async getUser(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new RecordNotFoundException('user_with_id_not_found');
        }
        return userToUserDto(user);
    }

    async updateUser(
        userId: number,
        {
            firstName,
            lastName,
            isVerifiedStudent,
            role,
            emailAddress,
            isActive,
        }: UpdateUserDto,
    ) {
        let lastVerifiedAsStudent;
        if (isVerifiedStudent !== undefined) {
            lastVerifiedAsStudent = isVerifiedStudent ? new Date() : null;
        }
        const updateResult = await this.userRepository.update({ id: userId }, {
            firstName,
            lastName,
            lastVerifiedAsStudent,
            role,
            emailAddress,
            isActive,
        } as Partial<User>);

        if (updateResult.affected === 0) {
            throw new RecordNotFoundException('user_with_id_not_found');
        }
    }

    async removeUser(userId: number) {
        const deleteResult = await this.userRepository.delete({
            id: userId,
        });

        if (deleteResult.affected === 0) {
            throw new RecordNotFoundException('user_with_id_not_found');
        }
    }
}
