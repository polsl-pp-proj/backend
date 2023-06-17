import { SimpleProjectDto } from './project.dto';

export class SearchResultDto extends SimpleProjectDto {
    rank?: number;
    paymentAmount?: number;
    favoriteCount?: number;

    constructor(searchResult: SearchResultDto) {
        super(searchResult);
    }
}
