import { BadRequestException } from '@nestjs/common';
import {
  KeyOfSortOptions,
  SortOptions,
  SortOptionsType,
} from '../dto/searchRoom.dto';

export const sortParser = (sort: SortOptionsType): KeyOfSortOptions => {
  if (sort === SortOptions.CreatedAt) {
    return 'CreatedAt';
  } else {
    throw new BadRequestException(
      `Wrong query parameter: 'sort=${sort}'. Parameter 'sort' should be 'date'.`,
    );
  }
};
