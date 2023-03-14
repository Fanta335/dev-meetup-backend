import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PublicFile {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  url: string;

  @ApiProperty()
  @Column()
  key: string;

  constructor(url: string, key: string);
  constructor(url: string, key: string, id: number);
  constructor(url: string, key: string, id?: number) {
    this.id = id ?? undefined;
    this.url = url;
    this.key = key;
  }
}
