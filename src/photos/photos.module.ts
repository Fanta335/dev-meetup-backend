import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotosRepository } from './entity/photo.repository';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';

@Module({
  imports: [TypeOrmModule.forFeature([PhotosRepository])],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
