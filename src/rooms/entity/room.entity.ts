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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 120 })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => User, (user) => user.ownRooms, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  owners: User[];

  @ManyToMany(() => User, (user) => user.belongingRooms, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  members: User[];

  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];

  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  avatar: PublicFile;
}
