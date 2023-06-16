import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { join } from 'path';
import { randomUUID } from 'crypto';

export const filesInterceptorConfig: MulterOptions = {
    limits: { fileSize: 1000000, files: 9 },
    storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (req, file, callback) => {
            callback(
                undefined,
                randomUUID().replace(/-/g, '') +
                    (file.mimetype === 'image/png' ? '.png' : '.jpg'),
            );
        },
    }),
    fileFilter: (req, file, callback) => {
        if (['image/png', 'image/jpeg'].includes(file.mimetype)) {
            callback(undefined, true);
            return;
        }
        callback(new BadRequestException('invalid_file_type'), false);
    },
};
