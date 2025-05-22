// portafolio-backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Organization } from './organization/entities/organization.entity';
import { Opportunity } from './opportunity/entities/opportunity.entity';
import { Application } from './application/entities/application.entity';
import { UserModule } from './user/user.module';
import { OrganizationModule } from './organization/organization.module';
import { OpportunityModule } from './opportunity/opportunity.module';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          User, 
          Organization,
          Opportunity,
          Application,
        ],
        synchronize: process.env.NODE_ENV !== 'production', 
        autoLoadEntities: true,
      }),
      inject: [ConfigService], 
    }),

    UserModule,
    OrganizationModule,
    OpportunityModule,
    ApplicationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}