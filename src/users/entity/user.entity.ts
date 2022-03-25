import { Message } from 'src/messages/entity/message.entity';
import { Photo } from 'src/photos/entity/photo.entity';
import { Room } from 'src/rooms/entity/room.entity';
import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 24, unique: true })
  subId: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];

  @OneToMany(() => Message, (message) => message.author)
  messages: Message[];

  @ManyToMany(() => Room, (room) => room.owners)
  @JoinTable({
    // Name of the junction table will be as follows.
    name: 'ownership',
    joinColumn: {
      name: 'ownerId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roomId',
      referencedColumnName: 'id',
    },
  })
  myRooms: Room[];

  @ManyToMany(() => Room, (room) => room.members)
  @JoinTable({
    name: 'belonging',
    joinColumn: {
      name: 'memberId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roomId',
      referencedColumnName: 'id',
    },
  })
  rooms: Room[];
}
