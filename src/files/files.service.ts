import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublicFile } from './entity/publicFile.entity';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import sharp from 'sharp';
import { imageMimetypeSet } from './imageMimetypeSet';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(PublicFile)
    private publicFilesRepository: Repository<PublicFile>,
    private readonly configService: ConfigService,
  ) {}

  async uploadPublicFile(
    dataBuffer: Buffer,
    filename: string,
    mimetype: string,
  ): Promise<PublicFile> {
    this.validateMimetype(mimetype);
    const resizedDataBuffer = await sharp(dataBuffer)
      .rotate()
      .resize(300)
      .toBuffer();
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: resizedDataBuffer,
        Key: `${uuid()}-${filename}`,
        ContentType: `${mimetype}`,
      })
      .promise();

    const newFile = this.publicFilesRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });

    return this.publicFilesRepository.save(newFile);
  }

  async addDefaultAvatar(
    avatarUrl: string,
    username: string,
  ): Promise<PublicFile> {
    const newFile = this.publicFilesRepository.create({
      key: `${uuid()}-${username}`,
      url: avatarUrl,
    });

    return this.publicFilesRepository.save(newFile);
  }

  async deletePublicFile(fileId: number) {
    const file = await this.publicFilesRepository.findOne({
      where: { id: fileId },
    });
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: file.key,
      })
      .promise();

    await this.publicFilesRepository.delete(fileId);
  }

  validateMimetype(mimetype: string) {
    if (!imageMimetypeSet.has(mimetype)) {
      throw new ForbiddenException(`The file mimetype is not valid.`);
    }
  }
}
