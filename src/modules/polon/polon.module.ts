import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PolonService } from './services/polon/polon.service';
import { PolonController } from './controllers/polon/polon.controller';

@Module({
    providers: [PolonService],
    controllers: [PolonController],
    imports: [HttpModule],
})
export class PolonModule {}
