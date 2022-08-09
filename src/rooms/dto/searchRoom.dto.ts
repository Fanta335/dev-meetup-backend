import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SearchRoomDTO {
  @ApiProperty()
  @IsString()
  query: string;

  @ApiProperty()
  @IsNumber()
  offset: number;

  @ApiProperty()
  @IsNumber()
  limit: number;

  @ApiProperty()
  @IsString()
  sort: SortOptionsType;

  @ApiProperty()
  @IsString()
  order: OrderOptionsType;

  // categoryId: number;
  @ApiProperty()
  @IsNumber()
  tagIds: number | number[];
}

export const SortOptions = {
  CreatedAt: 'date',
} as const;
export type KeyOfSortOptions = keyof typeof SortOptions;
export type SortOptionsType = typeof SortOptions[KeyOfSortOptions];

export const OrderOptions = {
  ASC: 'a',
  DESC: 'd',
} as const;
export type KeyOfOrderOptions = keyof typeof OrderOptions;
export type OrderOptionsType = typeof OrderOptions[KeyOfOrderOptions];
