import { BadRequestException } from '@nestjs/common';
import { KeyOfSortOptions, SortOptions } from '../types';

export const sortParser = (sort: string | string[]): KeyOfSortOptions => {
  if (sort === SortOptions.CreatedAt) {
    return 'CreatedAt';
  } else {
    throw new BadRequestException(
      `Wrong query parameter: 'sort=${sort}'. Parameter 'sort' should be 'date'.`,
    );
  }
};
