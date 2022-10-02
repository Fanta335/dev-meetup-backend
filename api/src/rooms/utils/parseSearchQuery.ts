import { SearchRoomDTO } from '../dto/searchRoom.dto';
import { ParsedSearchQuery } from '../types';
import { orderParser } from './orderParser';
import { sortParser } from './sortParser';

export const parseSearchQuery = (
  searchRoomDTO: SearchRoomDTO,
): ParsedSearchQuery => {
  const { query, offset, limit, sort, order, tagId } = searchRoomDTO;
  return {
    query: toString(query),
    offset: toNumber(offset),
    limit: toNumber(limit),
    sort: sortParser(sort),
    order: orderParser(order),
    tagId: toNumber(tagId),
  };
};

export const toString = (value: string | string[]): string => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

export const toNumber = (value: string | string[]): number => {
  if (Array.isArray(value)) {
    return Number(value[0]);
  }
  return Number(value);
};
