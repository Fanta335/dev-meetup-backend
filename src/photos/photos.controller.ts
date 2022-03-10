import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreatePhotoDTO } from './dto/photo.dto';
import { Photo } from './entity/photo.entity';
import { PhotosService } from './photos.service';

@Controller('photos')
export class PhotosController {
  constructor(private photosService: PhotosService) {}

  @Post()
  async create(@Body() createPhotoDTO: CreatePhotoDTO) {
    return this.photosService.create(createPhotoDTO);
  }

  @Get()
  async findAll(): Promise<Photo[]> {
    return this.photosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Photo> {
    return this.photosService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.photosService.remove(id);
  }
}
