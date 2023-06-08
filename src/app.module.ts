import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import * as dotenv from 'dotenv';
import { OrganizationModule } from './modules/organization/organization.module';
import { AssetModule } from './modules/asset/asset.module';
import { DonationModule } from './modules/donation/donation.module';
import { NotificationModule } from './modules/notification/notification.module';
dotenv.config();

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            synchronize: false,
        }),
        AuthModule,
        UserModule,
        OrganizationModule,
        AssetModule,
        DonationModule,
        NotificationModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
