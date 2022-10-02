import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { CreateTagDTO } from '../dto/createTag.dto';
import { Tag } from './tag.entity';

@CustomRepository(Tag)
export class TagsRepository extends Repository<Tag> {
  async createTag(createTagDTO: CreateTagDTO): Promise<Tag> {
    const { name, description } = createTagDTO;
    const tag = new Tag();
    tag.name = name;
    tag.description = description;

    return this.save(tag);
  }

  async getOneById(id: number): Promise<Tag> {
    return this.findOne({ where: { id: id } });
  }

  async getManyByIds(ids: number[]): Promise<Tag[]> {
    return this.createQueryBuilder('tag')
      .where('tag.id IN (:...tagIds)', { tagIds: ids })
      .getMany();
  }
}
