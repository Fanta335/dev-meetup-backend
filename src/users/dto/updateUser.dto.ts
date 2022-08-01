import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString() @IsOptional() description: string | undefined;
}
