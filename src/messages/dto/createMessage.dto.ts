import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDTO {
  @IsNumber() authorId: number;
  @IsNumber() roomId: number;
  @IsString() content: string;
  @IsNumber() parentId: number | null;
}
