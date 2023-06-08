export class OpenPositionDto {
    name: string;
    description: string;
    requirements: string[];

    constructor(partialOpenPositionDto: Partial<OpenPositionDto>) {
        Object.assign(this, partialOpenPositionDto);
    }
}
