import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { logger } from './logger/loggerBase';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  app.enableCors({
    allowedHeaders: '*',
    origin: '*'
  });

  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Clients API')
    .setDescription('The clients API description')
    .setVersion('1.0')
    .addTag('clients')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);

  const port = process.env.PORT ?? 8080;
  await app.listen(port, () =>
    logger.info(`API is running on PORT: ${port}`),
  );
}
bootstrap();
