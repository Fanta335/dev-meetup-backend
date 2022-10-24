import { ApiProperty } from '@nestjs/swagger';
import { PublicFile } from 'src/files/entity/publicFile.entity';
import { Message } from 'src/messages/entity/message.entity';
import { Tag } from 'src/tags/entity/tag.entity';
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
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Invitation } from 'src/invitations/entity/invitation.entity';

@Entity()
export class Room {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  @ManyToMany(() => Tag, (tag) => tag.rooms)
  tags: Tag[];

  @ApiProperty()
  @OneToMany(() => Message, (message) => message.room, {
    cascade: true,
    nullable: true,
  })
  messages: Message[];

  @ApiProperty()
  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  avatar: PublicFile;

  @ApiProperty()
  @OneToMany(() => Invitation, (invitation) => invitation.room, {
    cascade: true,
  })
  invitations: Invitation[];
}
