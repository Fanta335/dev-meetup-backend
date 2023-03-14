import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 24, unique: true, select: false })
  subId: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ unique: true, select: false })
  email: string;

  @ApiProperty()
  @Column({ length: 150 })
  description: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt?: Date;

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt?: Date;

  @ApiProperty()
  @OneToMany(() => Message, (message) => message.author)
  messages?: Message[];

  @ApiProperty({ type: () => [Room] })
  @ManyToMany(() => Room, (room) => room.owners, {})
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
  ownRooms?: Room[];

  @ApiProperty({ type: () => [Room] })
  @ManyToMany(() => Room, (room) => room.members, {})
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
  belongingRooms?: Room[];

  @ApiProperty()
  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  avatar?: PublicFile;

  constructor(subId: string, name: string, email: string, description: string);
  constructor(
    subId: string,
    name: string,
    email: string,
    description: string,
    id: number,
    createdAt: Date,
  );
  constructor(
    subId: string,
    name: string,
    email: string,
    description: string,
    id?: number,
    createdAt?: Date,
  ) {
    this.id = id ?? undefined;
    this.subId = subId;
    this.name = name;
    this.email = email;
    this.description = description;
    this.createdAt = createdAt ?? undefined;
  }
}
