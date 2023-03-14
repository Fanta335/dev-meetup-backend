import { faker } from '@faker-js/faker';
import { Room } from 'src/rooms/entity/room.entity';
import { RoomBuilder } from 'src/rooms/entity/RoomBuilder';

export class FakeRoomBuilder extends RoomBuilder {
  constructor() {
    super();
  }

  buildFakeRoom = (): Room => {
    this.setId(faker.datatype.uuid())
      .setName(faker.name.fullName())
      .setDescription(faker.lorem.text().substring(0, 120))
      .setIsPrivate(faker.datatype.boolean())
      .setCreatedAt(faker.date.between('2020-01-01T00:00:00.000Z', new Date()));
    return this.build();
  };

  buildFakeRoomArray = (length: number): Room[] => {
    const roomArray = [];
    for (let i = 0; i < length; i++) {
      roomArray.push(this.buildFakeRoom());
    }
    return roomArray;
  };
}
