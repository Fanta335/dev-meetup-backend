import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity() // relationはあとで追記する
export class Message {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  authorId: number;

  @Column({ nullable: true, type: 'int' })
  roomId: number;

  @Column()
  content: string;

  @Column({ nullable: true, type: 'int' })
  parentMessageId: number | null;

  @Column({ nullable: true, type: 'int' })
  mentionId: number | null;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
