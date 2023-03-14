import { PublicFile } from './publicFile.entity';

export class PublicFileBuilder {
  id: number;
  url: string;
  key: string;

  constructor() {
    this.reset();
  }

  reset = () => {
    this.id = undefined;
    this.url = undefined;
    this.key = undefined;
  };

  setId = (id: number) => {
    this.id = id;
    return this;
  };

  setUrl = (url: string) => {
    this.url = url;
    return this;
  };

  setKey = (key: string) => {
    this.key = key;
    return this;
  };

  build = () => {
    const publicFile = new PublicFile(this.url, this.key);
    this.reset();
    return publicFile;
  };
}
