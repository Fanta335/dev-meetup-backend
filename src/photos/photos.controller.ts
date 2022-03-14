import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { CreatePhotoDTO } from './dto/createPhoto.dto';
import { Photo } from './entity/photo.entity';
import { PhotosService } from './photos.service';

@Controller('photos')
export class PhotosController {
  constructor(private photosService: PhotosService) {}

  @Post()
  async createPhoto(user: User, @Body() createPhotoDTO: CreatePhotoDTO) {
    return this.photosService.createPhoto(user, createPhotoDTO);
  }

  @Get()
  async getAllPhotos(): Promise<Photo[]> {
    return this.photosService.getAllPhotos();
  }

  @Get(':id')
  async getByPhotoId(@Param('id') id: string): Promise<Photo> {
    return this.photosService.getByPhotoId(Number(id));
  }

  @Delete(':id')
  async deletePhoto(@Param('id') id: string) {
    return this.photosService.deletePhoto(Number(id));
  }
}
