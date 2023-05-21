import { Module } from '@nestjs/common';
import { AssetRepository } from './repositories/asset.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Asset])],
    providers: [AssetRepository],
})
export class AssetModule {}
