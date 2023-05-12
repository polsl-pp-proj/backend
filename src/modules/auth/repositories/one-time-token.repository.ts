import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { OneTimeToken } from '../entities/one-time-token.entity';
import { OneTimeTokenType } from '../enums/one-time-token-type.enum';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';

@Injectable()
export class OneTimeTokenRepository extends Repository<OneTimeToken> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        entityManager?: EntityManager,
    ) {
        super(OneTimeToken, entityManager ?? dataSource.createEntityManager());
    }

    async generateOneTimeToken(
        emailAddress: string,
        type: OneTimeTokenType,
        expiry: Date,
    ): Promise<string> {
        return await this.manager.transaction(async (manager) => {
            const oneTimeTokenRepository = new OneTimeTokenRepository(
                manager.connection,
                manager,
            );
            const userRepository = new UserRepository(
                manager.connection,
                manager,
            );

            const user = await userRepository.findOne({
                where: { emailAddress },
            });
            if (user) {
                const oneTimeToken = oneTimeTokenRepository.create({
                    expiry,
                    isActive: true,
                    type,
                    user,
                    userId: user.id,
                    uuid: randomUUID(),
                });
                await oneTimeTokenRepository.save(oneTimeToken);
                return oneTimeToken.uuid;
            }
            throw new RecordNotFoundException(
                'user_with_email_address_does_not_exist',
            );
        });
    }
}
