import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/common/enums';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsEnum(Role)
    @IsOptional()
    role?: Role
}
