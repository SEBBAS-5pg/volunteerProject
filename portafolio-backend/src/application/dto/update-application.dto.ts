import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationDto } from './create-application.dto';
import { ApplicationStatus } from 'src/common/enums';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
    @IsEnum(ApplicationStatus)
    @IsOptional()
    status?: ApplicationStatus
}
