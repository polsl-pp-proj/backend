export class RefreshTokenPayloadDto {
    userId: number;
    uuid: string;
    forUuid: string;

    constructor(
        partialRefreshTokenPayloadDto: Partial<RefreshTokenPayloadDto> = {},
    ) {
        Object.assign(this, partialRefreshTokenPayloadDto);
    }
}

export type DecodedRefreshTokenPayloadDto = RefreshTokenPayloadDto & {
    exp: number;
    iat: number;
    iss: string;
};
