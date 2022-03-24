import { User } from './entity/user.entity';

export const testUser: User = {
  id: 12345,
  subId: 'testusersubid',
  name: 'test_user',
  email: 'test-user@example.com',
  photos: [],
  messages: [],
  myRooms: [],
  rooms: [],
  createdAt: new Date('2022-03-12T13:16:06'),
  updatedAt: new Date('2022-03-12T13:16:06'),
};
