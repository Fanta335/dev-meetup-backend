import { User } from 'src/users/entity/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column('text')
  description: string;

  @Column()
  filename: string;

  @Column({ type: 'int', default: 0 })
  views: number;

  @Column({ default: false })
  isPublished: boolean;

  @ManyToOne(() => User, (user) => user.photos)
  user: User;
}
