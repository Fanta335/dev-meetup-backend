import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { CreatePhotoDTO } from './dto/createPhoto.dto';
import { Photo } from './entity/photo.entity';
import { PhotosRepository } from './entity/photo.repository';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(PhotosRepository)
    private photosRepository: PhotosRepository,
  ) {}

  createPhoto(user: User, createPhotoDTO: CreatePhotoDTO): Promise<Photo> {
    return this.photosRepository.createPhoto(createPhotoDTO, user);
  }

  getAllPhotos(): Promise<Photo[]> {
    return this.photosRepository.getAllPhotos();
  }

  async getByPhotoId(id: number): Promise<Photo> {
    const photo = await this.photosRepository.getByPhotoId(id);
    if (!photo) {
      throw new NotFoundException(`Photo not found matched id: '${id}'`);
    }

    return photo;
  }

  async deletePhoto(id: number): Promise<Photo> {
    const photo = await this.getByPhotoId(id);

    return this.photosRepository.remove(photo);
  }
}
