import { BadRequestException } from '@nestjs/common';
import { KeyOfOrderOptions, OrderOptionsType } from '../dto/searchRoom.dto';

export const orderParser = (order: OrderOptionsType): KeyOfOrderOptions => {
  if (order === 'a') {
    return 'ASC';
  } else if (order === 'd') {
    return 'DESC';
  } else {
    throw new BadRequestException(
      `Wrong query parameter: 'order=${order}'. Parameter 'order' should be 'a' or 'd'.`,
    );
  }
};
