import { SimpleUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

export const userToSimpleUserDto = (user: User) => {
    return new SimpleUserDto({
        id: user.id,
        emailAddress: user.emailAddress,
        isActive: user.isActive,
    });
};
