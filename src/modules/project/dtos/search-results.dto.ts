import { SearchResultDto } from './search-result.dto';

export class SearchResultsDto {
    page: number;
    pageCount: number;
    projects: SearchResultDto[];

    constructor(searchResultsDto: SearchResultsDto) {
        Object.assign(this, searchResultsDto);
    }
}
