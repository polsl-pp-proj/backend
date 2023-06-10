import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { json } from 'express';
import { rawBodyBuffer } from './helpers/raw-body-buffer.helper';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
        cors: { origin: '*' },
    });
    app.use(json({ verify: rawBodyBuffer }));
    app.enableVersioning({ type: VersioningType.URI });

    await app.listen(3000);
}
bootstrap();
