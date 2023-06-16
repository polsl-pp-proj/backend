import { FunderDto } from './funder.dto';

export class DonationStatsDto {
    raised: {
        lastMonth: number;
        total: number;
    };
    lastFunders: FunderDto[];

    constructor({
        raised: { lastMonth, total },
        lastFunders,
    }: DonationStatsDto) {
        this.raised = {
            lastMonth,
            total,
        };
        this.lastFunders = lastFunders;
    }
}
