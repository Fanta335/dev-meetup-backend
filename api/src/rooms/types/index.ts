export type RoomRelation =
  | 'owners'
  | 'members'
  | 'messages'
  | 'avatar'
  | 'tags';

export type ParsedSearchQuery = {
  query: string;
  offset: number;
  limit: number;
  sort: KeyOfSortOptions;
  order: KeyOfOrderOptions;
  tagId: number;
};

export const SortOptions = {
  createdAt: 'date',
} as const;
export type KeyOfSortOptions = keyof typeof SortOptions;
export type SortOptionsType = typeof SortOptions[KeyOfSortOptions];

export const OrderOptions = {
  ASC: 'a',
  DESC: 'd',
} as const;
export type KeyOfOrderOptions = keyof typeof OrderOptions;
export type OrderOptionsType = typeof OrderOptions[KeyOfOrderOptions];
