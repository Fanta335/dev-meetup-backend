import { IsNumber } from 'class-validator';

export class RemoveOwnerDTO {
  @IsNumber() userIdToRemove: number;
}
