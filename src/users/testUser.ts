import { User } from './entity/user.entity';

export const testUser: User = {
  id: 12345,
  firstName: 'test',
  lastName: 'user',
  photos: [],
  messages: [],
  myRooms: [],
  rooms: [],
  createdAt: new Date('2022-03-12T13:16:06'),
  updatedAt: new Date('2022-03-12T13:16:06'),
};
