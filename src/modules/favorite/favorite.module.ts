import { Module } from '@nestjs/common';
import { PolonModule } from '../polon/polon.module';
import { FavoriteService } from './services/favorite/favorite.service';
import { FavoriteController } from './controllers/favorite/favorite.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteProject } from './entities/favorite-project.entity';
import { ProjectModule } from '../project/project.module';

@Module({
    controllers: [FavoriteController],
    imports: [
        TypeOrmModule.forFeature([FavoriteProject]),
        UserModule,
        ProjectModule,
        PolonModule,
    ],
    providers: [FavoriteService],
})
export class FavoriteModule {}
