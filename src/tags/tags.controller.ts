import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTagDTO } from './dto/createTag.dto';
import { Tag } from './entity/tag.entity';
import { TagsService } from './tags.service';

@ApiBearerAuth()
@ApiTags('tags')
@Controller('tags')
@UseGuards(AuthGuard('jwt'))
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Post()
  createTag(@Body() createTagDTO: CreateTagDTO): Promise<Tag> {
    return this.tagsService.createTag(createTagDTO);
  }

  @Get()
  getAllTags(): Promise<Tag[]> {
    return this.tagsService.getAllTags();
  }
}
