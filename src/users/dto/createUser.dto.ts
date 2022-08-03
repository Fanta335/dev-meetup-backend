import { IsEmail, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString() name: string;
  @IsEmail() email: string;
  @IsString() subId: string;
  @IsString() avatarUrl: string;
}
