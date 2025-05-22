import { IsDateString, IsString, IsUUID } from "class-validator";

export class CreateOpportunityDto {
    @IsString()
    tittle: string

    @IsString()
    description: string;

    @IsString()
    location: string;

    @IsDateString()
    startDate: string

    @IsDateString()
    endDate: string

    @IsUUID()
    organizationId: string
}
