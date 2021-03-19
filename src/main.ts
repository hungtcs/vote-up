import path from 'path';
import nunjucks from 'nunjucks';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  const baseViewsDir = path.join(__dirname, 'views');
  nunjucks.configure(
    [baseViewsDir],
    {
      watch: true,
      noCache: true,
      express: app,
      trimBlocks: true,
      lstripBlocks: true,
      throwOnUndefined: true
    },
  );

  app.setViewEngine('njk');
  app.setBaseViewsDir(baseViewsDir);
  app.useStaticAssets(path.join(__dirname, 'assets'), { prefix: '/assets' });
  app.useStaticAssets(path.join(__dirname, 'styles'), { prefix: '/styles' });

  SwaggerModule.setup(
    'swagger',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Music Service')
        .setDescription('namera music rest api')
        .setVersion('0.0.1')
        .addBearerAuth()
        .addServer('/', 'default')
        .build(),
    ),
  );

  app.useGlobalPipes(
    new ValidationPipe(
      {
        transform: true,
        whitelist: true,
        exceptionFactory: errors => new BadRequestException(errors),
        validationError: {
          value: false,
          target: false,
        },
        skipNullProperties: false,
      },
    ),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
