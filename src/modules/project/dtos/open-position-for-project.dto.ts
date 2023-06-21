import { OpenPositionDto } from './open-position.dto';

export class OpenPositionForProjectDto extends OpenPositionDto {
    projectId: number;
    projectName: string;

    constructor(openPosition: OpenPositionForProjectDto) {
        super(openPosition);
    }
}
