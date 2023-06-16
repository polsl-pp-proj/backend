export class FunderDto {
    name: string;
    isAnonymous: boolean;
    amount: number;
    date: number;

    constructor(funderDto: FunderDto) {
        Object.assign(this, funderDto);
    }
}
