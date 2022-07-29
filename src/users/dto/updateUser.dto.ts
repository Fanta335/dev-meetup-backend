import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString() @IsOptional() name: string | undefined;
  @IsEmail() @IsOptional() email: string | undefined;
  @IsString() @IsOptional() password: string | undefined;
}
