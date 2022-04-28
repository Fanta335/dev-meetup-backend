export class CreateMessageDTO {
  authorId: number;
  roomId: number;
  content: string;
  parentId: number | null;
}
