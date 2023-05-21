import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Asset } from '../entities/asset.entity';
import { copyFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { parse, join, format } from 'path';
import { randomUUID } from 'crypto';
import { AssetType } from '../enums/asset-type.enum';
import { AssetDto } from '../dtos/asset.dto';

const hostedImagesPathDir = join('assets');

@Injectable()
export class AssetRepository extends Repository<Asset> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        entityManager?: EntityManager,
    ) {
        super(Asset, entityManager ?? dataSource.createEntityManager());
    }

    async createAsset(asset: AssetDto, randomNewPath = false): Promise<Asset> {
        const { url, title, type } = asset;
        if (type === AssetType.Image) {
            return await this.manager.transaction(async (manager) => {
                const assetRepository = new AssetRepository(
                    manager.connection,
                    manager,
                );

                const newPath = this.getNewPath(url, randomNewPath);

                const newAsset = assetRepository.create({
                    type,
                    title,
                    url: format(newPath),
                });
                await assetRepository.save(newAsset, { reload: true });

                try {
                    newPath.dir = join(process.cwd(), 'public', newPath.dir);
                    if (!existsSync(newPath.dir)) {
                        await mkdir(newPath.dir, {
                            mode: 0o711,
                            recursive: true,
                        });
                    }
                    await copyFile(url, format(newPath));
                } catch (ex) {
                    if (!randomNewPath) {
                        return await assetRepository.createAsset(asset, true);
                    }
                    throw ex;
                }

                return newAsset;
            });
        }
        throw new Error('AssetType not implemented.');
    }

    private getNewPath(url: string, randomNewPath: boolean) {
        const path = parse(url);
        path.dir = hostedImagesPathDir;
        if (randomNewPath) {
            const newFileName = randomUUID().replace(/-/g, '');
            path.name = newFileName;
            path.base = path.name + path.ext;
        }
        return path;
    }
}
