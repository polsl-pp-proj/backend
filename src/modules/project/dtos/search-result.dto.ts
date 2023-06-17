import { SimpleProjectDto } from './project.dto';

export class SearchResultDto extends SimpleProjectDto {
    rank?: number;
    donationAmount?: number;
    favoriteCount?: number;

    constructor(searchResult: SearchResultDto) {
        super(searchResult);
    }
}
