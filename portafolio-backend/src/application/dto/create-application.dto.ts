import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { ApplicationStatus } from "src/common/enums";

export class CreateApplicationDto {
    @IsUUID()
    userId: string
    
    @IsUUID()
    opportunityId: string

    @IsEnum(ApplicationStatus)
    @IsOptional()
    status?: ApplicationStatus
}
