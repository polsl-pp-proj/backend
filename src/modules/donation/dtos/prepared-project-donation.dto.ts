export class PreparedProjectDonationDto {
    clientSecret: string;

    constructor(preparedProjectDonationDto: PreparedProjectDonationDto) {
        Object.assign(this, preparedProjectDonationDto);
    }
}
