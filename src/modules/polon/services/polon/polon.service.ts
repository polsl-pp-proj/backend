import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PolonAcademicInstitutionsDto } from '../../dtos/polon-academic-institutions.dto';
import { catchError, map } from 'rxjs';
import { PolonAcademicInstitutionDto } from '../../dtos/polon-academic-institution.dto';
import { AxiosError } from 'axios';

@Injectable()
export class PolonService {
    constructor(private readonly httpService: HttpService) {}

    getAcademicInstitutions() {
        return this.httpService
            .get<PolonAcademicInstitutionsDto>(
                'https://polon.nauka.gov.pl/opi-ws/api/academicInstitutions',
                {
                    responseType: 'json',
                },
            )
            .pipe(map((response) => response.data));
    }

    checkAcademicInstitutionEmail(
        academicInstitutionId: string,
        emailAddress: string,
    ) {
        return this.httpService
            .get<PolonAcademicInstitutionDto>(
                `https://polon.nauka.gov.pl/opi-ws/api/institutions/${academicInstitutionId}`,
            )
            .pipe(
                map((response) => response.data),
                map((institution) => {
                    if (institution.status !== 'OPERATING') {
                        throw new Error('provided_university_does_not_exist');
                    }

                    const studentEmailUrl = new URL(`https://${emailAddress}`); // hack to use URL object with email address
                    const universityEmailUrl = new URL(
                        `https://${institution.email}`,
                    );
                    const universityWebsiteUrl = new URL(institution.www);

                    if (
                        !studentEmailUrl.hostname.endsWith(
                            universityEmailUrl.hostname,
                        ) &&
                        !studentEmailUrl.hostname.endsWith(
                            universityWebsiteUrl.hostname,
                        )
                    ) {
                        throw new Error(
                            'provided_email_does_not_contain_university_domain_name',
                        );
                    }
                    return true;
                }),
                catchError((error) => {
                    if (error instanceof AxiosError) {
                        if (error.response?.status === 404) {
                            throw new Error(
                                'provided_university_does_not_exist',
                            );
                        } else {
                            throw new Error(
                                'something_went_wrong_when_checking_university_domain_name',
                            );
                        }
                    }
                    throw error;
                }),
            );
    }
}
