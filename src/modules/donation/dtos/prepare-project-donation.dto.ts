import { IsBoolean, IsDefined, IsNumber } from 'class-validator';

export class PrepareProjectDonationDto {
    @IsDefined({ message: 'not_defined' })
    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: 'not_a_number' },
    )
    amount: number;

    @IsDefined({ message: 'not_defined' })
    @IsBoolean({ message: 'not_boolean' })
    isAnonymous: boolean;
}
