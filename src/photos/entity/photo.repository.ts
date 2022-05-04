import { User } from 'src/users/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreatePhotoDTO } from '../dto/createPhoto.dto';
import { Photo } from './photo.entity';

@EntityRepository(Photo)
export class PhotosRepository extends Repository<Photo> {
  createPhoto({ name }: CreatePhotoDTO, user: User): Promise<Photo> {
    const photo = new Photo();
    photo.name = name;
    photo.userId = user.id;

    return this.save(photo);
  }

  getAllPhotos(): Promise<Photo[]> {
    return this.find();
  }

  getByPhotoId(id: number): Promise<Photo> {
    return this.findOne(id);
  }
}
