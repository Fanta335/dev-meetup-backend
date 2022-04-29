import { KeyOfOrderOptions, OrderOptionsType } from '../dto/searchRoom.dto';

export const orderParser = (order: OrderOptionsType): KeyOfOrderOptions => {
  if (order === 'a') {
    return 'ASC';
  } else if (order === 'd') {
    return 'DESC';
  } else {
    throw new Error(`Wrong query parameter: 'order=${order}'.`);
  }
};
