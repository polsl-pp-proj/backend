export const base64UrlEncode = (data: string) =>
    Buffer.from(data, 'utf-8').toString('base64url');

export const base64UrlDecode = (base64Url: string) =>
    Buffer.from(base64Url, 'base64url').toString('utf8');
