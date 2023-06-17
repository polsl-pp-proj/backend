import { FunderDto } from '../dtos/funder.dto';
import { ProjectDonation } from '../entities/project-donation.entity';

export const convertDonationToFunderDto = (
    donation: ProjectDonation,
): FunderDto =>
    new FunderDto({
        name: donation.isAnonymous
            ? 'Anonymous'
            : `${donation.user.firstName} ${donation.user.lastName.substring(
                  0,
                  1,
              )}.`,
        isAnonymous: donation.isAnonymous,
        date: donation.createdAt.valueOf(),
        amount: donation.amount,
    });
