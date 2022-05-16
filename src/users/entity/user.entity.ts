import { PublicFile } from 'src/files/entity/publicFile.entity';
import { Message } from 'src/messages/entity/message.entity';
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
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 24, unique: true, select: false })
  subId: string;

  @Column()
  name: string;

  @Column({ unique: true, select: false })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Message, (message) => message.author)
  messages: Message[];

  @ManyToMany(() => Room, (room) => room.owners, {
    onDelete: 'CASCADE',
  })
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
  ownRooms: Room[];

  @ManyToMany(() => Room, (room) => room.members, {
    onDelete: 'CASCADE',
  })
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
  belongingRooms: Room[];

  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  avatar: PublicFile;
}
