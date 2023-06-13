export class PolonAcademicInstitutionDto {
    results: { description?: string; errorCode: string; message?: string }[];
    version: string;
    uid: string;
    mainUid: string;
    name: string;
    fullName: string;
    code: string;
    supervisingInstitutionName: string;
    kind:
        | 'SUPERVISING_INSTITUTION'
        | 'ADDITIONAL_SUPERVISING_INSTITUTION'
        | 'MONITORING_INSTITUTION'
        | 'AUTONOSTRIFICATION_INSTITUTION'
        | 'PUBLIC_UNIVERSITY'
        | 'PUBLIC_INSTITUTIONS_UNION'
        | 'NONPUBLIC_UNIVERSITY'
        | 'ECCLESIASTICAL_UNIVERSITY'
        | 'UNIVERSITY_UNIT'
        | 'SCIENTIFIC_INSTITUTION'
        | 'SCIENTIFIC_UNIT'
        | 'HISTORICAL_INSTITUTION'
        | 'BUSINESS_ENTITY'
        | 'NATIONAL_INSTITUTION'
        | 'FOREIGN_INSTITUTION'
        | 'FOREIGN_UNIVERSITY'
        | 'FOREIGN_SCIENTIFIC';
    universityType:
        | 'COLLEGE'
        | 'ASSOCIATION_OF_UNIVERSITIES'
        | 'NO_TYPE_FOR_ECCLESIASTICAL'
        | 'NO_TYPE_FOR_NONPUBLIC'
        | 'ART_SCHOOL'
        | 'ECONOMIC_UNIVERSITY'
        | 'MEDICAL_SCHOOL'
        | 'MARITIME_UNIVERSITY'
        | 'PEDAGOGICAL_UNIVERSITY'
        | 'AGRICULTURAL_UNIVERSITY'
        | 'SCHOOL_OF_STATE_SERVICES'
        | 'TECHNICAL_UNIVERSITY'
        | 'THEOLOGICAL_UNIVERSITY'
        | 'MILITARY_SCHOOL'
        | 'ACADEMY_OF_PHYSICAL_EDUCATION'
        | 'VOCATIONAL_UNIVERSITY'
        | 'UNIVERSITY';
    scientificInstitutionType?:
        | 'ALL_SCIENTIFIC_INSTITUTIONS'
        | 'PAS_INSTITUTE'
        | 'RESEARCH_INSTITUTE'
        | 'INTERNATIONAL_SCIENTIFIC_INSTITUTE'
        | 'SCIENTIFIC_INSTITUTE';
    dateFrom: string;
    liquidationStart?: string;
    dateTo?: string;
    status:
        | 'OPERATING'
        | 'IN_LIQUIDATION'
        | 'LIQUIDATED'
        | 'TRANSFORMED'
        | 'RE_REGISTRATION';
    regon: string;
    www: string;
    phoneNumber: string;
    faxNumber: string;
    email: string;
    address: {
        country: string;
        city: string;
        street: string;
        buildingNumber?: string;
        localNumber?: string;
        postalCode: string;
        postalCity: string;
        voivodeship: string;
        stateProvince?: string;
    };
    isLaboratory: boolean;
    isLibrary: boolean;
    isBasic?: boolean;
    isNonresident?: boolean;
    isDidactic?: boolean;
    isScientific: boolean;
}
