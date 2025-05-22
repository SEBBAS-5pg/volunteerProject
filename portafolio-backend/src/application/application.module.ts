import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { UserModule } from 'src/user/user.module';
import { OpportunityModule } from 'src/opportunity/opportunity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    UserModule,
    OpportunityModule
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService, TypeOrmModule]
})
export class ApplicationModule {}
