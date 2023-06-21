import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getClientIp } from '@supercharge/request-ip';

/**
 * # **Decorator**
 * 
 * Injects string representation of client's IP.
 * 
 * Extracts request from `ExecutionContext` and passes it to 
 * `getClientIp` (`@supercharge/request-ip`) to get client IP.
 *
 * ### Version
 * <i>1.0.0</i> since **2021-03-04**
 *
 * ### Example
 * ``` typescript
showIp(@ClientIP() ip: string): string {
    return ip
}
```
 *
 * ### Author
 * [Patryk Bojczuk](https://github.com/patrykbojczuk) \<patryk@bojczuk.mail.pl\>
 */
export const ClientIP = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return getClientIp(request);
    },
);
