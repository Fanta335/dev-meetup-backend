import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'aws-sdk';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService = app.get(ConfigService);
  config.update({
    credentials: {
      accessKeyId: configService.get('S3_IAM_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('S3_IAM_SECRET_ACCESS_KEY'),
    },
    region: configService.get('AWS_REGION'),
  });

  const documentConfig = new DocumentBuilder()
    .setTitle('Dev Meetup API')
    .setDescription('This document descripbes the Dev Meetup API.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();
