import { JwtModuleOptions } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

export const jwtModuleConfig: JwtModuleOptions = {
    signOptions: {
        issuer: 'studenthub',
        algorithm: 'RS512',
    },
    verifyOptions: {
        issuer: 'studenthub',
        algorithms: ['RS512'],
    },
    privateKey: process.env.JWT_PRIVATE_KEY,
    publicKey: process.env.JWT_PUBLIC_KEY,
};
