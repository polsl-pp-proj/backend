import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (typeof value !== 'number') {
            throw new BadRequestException(
                'Date should be provided in millisecond-based timestamp format.',
            );
        }
        return new Date(value);
    }
}
