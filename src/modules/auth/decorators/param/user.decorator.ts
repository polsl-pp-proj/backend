import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserEntity } from '../../../user/entities/user.entity';
import { AuthTokenPayloadDto } from '../../dtos/auth-token-payload.dto';
import { IssuedRefreshToken as IssuedRefreshTokenEntity } from '../../entities/issued-refresh-token.entity';

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return <AuthTokenPayloadDto | IssuedRefreshTokenEntity | UserEntity>(
            request.user
        );
    },
);

export const AuthTokenPayload = User;
export const IssuedRefreshToken = User;
