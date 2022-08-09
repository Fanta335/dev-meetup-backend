import { ApiProperty } from '@nestjs/swagger';
import { Room } from 'src/rooms/entity/room.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Tag {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty({ type: () => [Room] })
  @ManyToMany(() => Room, (room) => room.tags)
  @JoinTable({
    name: 'rooms_tags',
    joinColumn: {
      name: 'tagId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roomId',
      referencedColumnName: 'id',
    },
  })
  rooms: Room[];
}
