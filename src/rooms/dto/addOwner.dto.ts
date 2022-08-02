import { IsNumber } from 'class-validator';

export class AddOwnerDTO {
  @IsNumber() userIdToAdd: number;
}
