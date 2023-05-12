import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { DecodedRefreshTokenPayloadDto } from '../dtos/refresh-token-payload.dto';
import { IssuedRefreshToken } from '../entities/issued-refresh-token.entity';

@Injectable()
export class IssuedRefreshTokenRepository extends Repository<IssuedRefreshToken> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        entityManager?: EntityManager,
    ) {
        super(
            IssuedRefreshToken,
            entityManager ?? dataSource.createEntityManager(),
        );
    }

    async insertIssuedRefreshToken({
        decodedRefreshToken,
        remoteIp,
    }: {
        decodedRefreshToken: DecodedRefreshTokenPayloadDto;
        remoteIp: string;
    }): Promise<IssuedRefreshToken> {
        const issuedRefreshToken = this.create({
            userId: decodedRefreshToken.userId,
            uuid: decodedRefreshToken.uuid,
            forAuthTokenUuid: decodedRefreshToken.forUuid,
            ipAddress: remoteIp,
            expiry: new Date(decodedRefreshToken.exp * 1000),
        });
        return await this.save(issuedRefreshToken);
    }

    async insertIssuedRefreshTokenWithOldDelete(tokenInsertionData: {
        decodedRefreshToken: DecodedRefreshTokenPayloadDto;
        remoteIp: string;
        oldRefreshTokenId: number;
    }) {
        return await this.manager.transaction(async (entityManager) => {
            const thisRepository = new IssuedRefreshTokenRepository(
                entityManager.connection,
                entityManager,
            );

            await thisRepository.deleteIssuedRefreshToken(
                tokenInsertionData.oldRefreshTokenId,
            );

            return await thisRepository.insertIssuedRefreshToken(
                tokenInsertionData,
            );
        });
    }

    async deleteIssuedRefreshToken(id: number) {
        return await this.delete({ id });
    }

    /**
     * @returns Array of UUIDs linked to auth tokens for which refresh tokens were issued
     */
    async deleteAllIssuedRefreshTokensForUser(userId: number) {
        return await this.manager.transaction(async (manager) => {
            const issuedRefreshTokenRepository =
                new IssuedRefreshTokenRepository(manager.connection, manager);
            const allTokens = await issuedRefreshTokenRepository.find({
                where: { userId },
            });
            await issuedRefreshTokenRepository.delete({
                userId,
            });
            return allTokens.map((token) => token.forAuthTokenUuid);
        });
    }
}
