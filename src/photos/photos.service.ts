import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreatePhotoDTO } from './dto/photo.dto';
import { Photo } from './photo.entity';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>,
  ) {}

  async create(newPhoto: CreatePhotoDTO) {
    const photo = this.photosRepository.create(newPhoto);
    const result = await this.photosRepository.save(photo);
    return result;
  }

  findAll(): Promise<Photo[]> {
    return this.photosRepository.find();
  }

  findOne(id: string): Promise<Photo> {
    return this.photosRepository.findOne(id);
  }

  async remove(id: string): Promise<DeleteResult> {
    const result = await this.photosRepository.delete(id);
    return result;
  }
}
