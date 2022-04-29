export class SearchRoomDTO {
  query: string;
  offset: number;
  limit: number;
  sort: SortOptionsType;
  order: OrderOptionsType;
  // categoryId: number;
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
