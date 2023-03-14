import { faker } from '@faker-js/faker';
import { PublicFile } from 'src/files/entity/publicFile.entity';
import { PublicFileBuilder } from 'src/files/entity/PublicFileBuilder';

export class FakePublicFileBuilder extends PublicFileBuilder {
  constructor() {
    super();
  }

  buildFakePublicFile = (): PublicFile => {
    this.setId(faker.datatype.number())
      .setUrl(faker.image.avatar())
      .setKey(faker.datatype.uuid());
    return this.build();
  };
}
