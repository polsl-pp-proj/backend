export const oneTimeTokenConfig = {
    expiry: 601200000, // one week in milliseconds
    getExpiryDate: (expiry: number = oneTimeTokenConfig.expiry) =>
        new Date(new Date().valueOf() + expiry),
};
