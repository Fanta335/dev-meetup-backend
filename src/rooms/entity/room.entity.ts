import { ApiProperty } from '@nestjs/swagger';
import { PublicFile } from 'src/files/entity/publicFile.entity';
import { Message } from 'src/messages/entity/message.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Room {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ length: 50 })
  name: string;

  @ApiProperty()
  @Column({ length: 120 })
  description: string;

  @ApiProperty()
  @Column()
  isPrivate: boolean;

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
  @ManyToMany(() => User, (user) => user.ownRooms, {
    cascade: true,
    nullable: false,
  })
  owners: User[];

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.belongingRooms, {
    cascade: true,
    nullable: false,
  })
  members: User[];

  @ApiProperty()
  @OneToMany(() => Message, (message) => message.room, { cascade: true })
  messages: Message[];

  @ApiProperty()
  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  avatar: PublicFile;
}
