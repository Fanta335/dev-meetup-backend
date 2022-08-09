import { Injectable } from '@nestjs/common';
import { CreateTagDTO } from './dto/createTag.dto';
import { Tag } from './entity/tag.entity';
import { TagsRepository } from './entity/tag.repository';

@Injectable()
export class TagsService {
  constructor(private tagsRepository: TagsRepository) {}

  async createTag(createTagDTO: CreateTagDTO): Promise<Tag> {
    return this.tagsRepository.createTag(createTagDTO);
  }

  async getAllTags(): Promise<Tag[]> {
    return this.tagsRepository.find();
  }

  async getById(id: number): Promise<Tag> {
    return this.tagsRepository.findOne({ where: { id: id } });
  }
}
