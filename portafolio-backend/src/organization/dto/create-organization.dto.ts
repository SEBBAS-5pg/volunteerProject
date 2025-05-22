import { IsEmail, IsString, MaxLength } from "class-validator";


export class CreateOrganizationDto {
    @IsString()
    name: string

    @IsEmail()
    email: string

    @IsString()
    @MaxLength(500, {message: 'Description cannot excedeed 500 characters'})
    description: string
}
