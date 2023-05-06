export class AuthTokensDto {
    authToken!: string;
    refreshToken!: string;

    constructor(authTokensDto: AuthTokensDto) {
        Object.assign(this, authTokensDto);
    }
}
