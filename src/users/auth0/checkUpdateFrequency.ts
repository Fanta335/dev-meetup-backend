import dayjs from 'dayjs';
import { UpdateUserDTO } from '../dto/updateUser.dto';
import { MysqlUser } from '../types';

const UPDATE_LIMITS = 7; // 7 days

export const isValidUpdateFrequency = (
  metadata: MysqlUser,
  currentDatetime: dayjs.Dayjs,
  updateUserDTO: UpdateUserDTO,
) => {
  for (const prop in updateUserDTO) {
    if (
      prop === 'name' &&
      currentDatetime.diff(dayjs(metadata.username_updated_at), 'day') <
        UPDATE_LIMITS
    ) {
      return false;
    }
    if (
      prop === 'email' &&
      currentDatetime.diff(dayjs(metadata.email_updated_at), 'day') <
        UPDATE_LIMITS
    ) {
      return false;
    }
    if (
      prop === 'password' &&
      currentDatetime.diff(dayjs(metadata.password_updated_at), 'day') <
        UPDATE_LIMITS
    ) {
      return false;
    }
  }
  return true;
};
