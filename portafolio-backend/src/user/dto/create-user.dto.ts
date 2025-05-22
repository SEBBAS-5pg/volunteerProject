import { IsEmail, IsEnum, IsString } from "class-validator";
import { Role } from "../../common/enums";

export class CreateUserDto {
    @IsString()
    name: string

    @IsEmail()
    email: string

    @IsEnum(Role)
    role: Role
}
