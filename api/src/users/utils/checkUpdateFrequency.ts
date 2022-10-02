import dayjs from 'dayjs';
import { UpdateRootUserDTO } from '../dto/updateRootUser.dto';
import { MysqlUser } from '../types';

const UPDATE_LIMITS = 1; // 1 days

export const isValidUpdateFrequency = (
  metadata: MysqlUser,
  currentDatetime: dayjs.Dayjs,
  updateUserDTO: UpdateRootUserDTO,
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
