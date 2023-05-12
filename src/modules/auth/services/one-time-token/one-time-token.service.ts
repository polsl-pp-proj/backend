import { Injectable } from '@nestjs/common';
import { IOneTimeTokenService } from 'src/interfaces/one-time-token.service.interface';
import { OneTimeTokenType } from '../../enums/one-time-token-type.enum';
import { oneTimeTokenConfig } from '../../configs/one-time-token.config';
import { OneTimeTokenRepository } from '../../repositories/one-time-token.repository';

@Injectable()
export class OneTimeTokenService implements IOneTimeTokenService {
    constructor(
        private readonly oneTimeTokenRepository: OneTimeTokenRepository,
    ) {}

    async generateOneTimeToken(
        emailAddress: string,
        type: OneTimeTokenType,
    ): Promise<string> {
        return await this.oneTimeTokenRepository.generateOneTimeToken(
            emailAddress,
            type,
            oneTimeTokenConfig.getExpiryDate(),
        );
    }
}
