import {
  KeyOfSortOptions,
  SortOptions,
  SortOptionsType,
} from '../dto/searchRoom.dto';

export const sortParser = (sort: SortOptionsType): KeyOfSortOptions => {
  if (sort === SortOptions.CreatedAt) {
    return 'CreatedAt';
  } else {
    throw new Error(`Wrong query parameter: 'sort=${sort}'.`);
  }
};
