import { ExtractJwt, StrategyOptions } from 'passport-jwt';
import { jwtModuleConfig } from 'src/modules/auth/configs/jwt-module.config';

export const jwtStrategyConfig: StrategyOptions = {
    secretOrKey: jwtModuleConfig.publicKey,
    ignoreExpiration: false,
    issuer: jwtModuleConfig.verifyOptions.issuer as string,
    algorithms: jwtModuleConfig.verifyOptions.algorithms,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
