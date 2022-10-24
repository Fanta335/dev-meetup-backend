import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Room } from 'src/rooms/entity/room.entity';

@Entity()
export class Invitation {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  roomId: string;

  @ApiProperty()
  @Column()
  expirationDate: Date;

  @ApiProperty()
  @Column()
  isUsed: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date;

  @ApiProperty()
  @ManyToOne(() => Room, (room) => room.invitations)
  @JoinColumn({
    name: 'roomId',
  })
  room: Room;
}
