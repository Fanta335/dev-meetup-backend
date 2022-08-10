import { ApiProperty } from '@nestjs/swagger';

export class SearchRoomDTO {
  @ApiProperty()
  query: string | string[];

  @ApiProperty()
  offset: string | string[];

  @ApiProperty()
  limit: string | string[];

  @ApiProperty()
  sort: string | string[];

  @ApiProperty()
  order: string | string[];

  @ApiProperty()
  tagId: string | string[];
}
