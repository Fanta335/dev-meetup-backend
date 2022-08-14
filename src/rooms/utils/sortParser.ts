import { BadRequestException } from '@nestjs/common';
import { KeyOfSortOptions, SortOptions } from '../types';

export const sortParser = (sort: string | string[]): KeyOfSortOptions => {
  if (sort === SortOptions.createdAt) {
    return 'createdAt';
  } else {
    throw new BadRequestException(
      `Wrong query parameter: 'sort=${sort}'. Parameter 'sort' should be 'date'.`,
    );
  }
};
