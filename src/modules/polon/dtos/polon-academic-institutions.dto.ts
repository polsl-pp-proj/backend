export class PolonAcademicInstitutionsDto {
    results: never[];
    version: '1.0';
    institutions: {
        uid: string;
        name: string;
        status:
            | 'OPERATING'
            | 'IN_LIQUIDATION'
            | 'LIQUIDATED'
            | 'TRANSFORMED'
            | 'RE_REGISTRATION';
    }[];
}
